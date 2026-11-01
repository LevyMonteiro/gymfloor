import { describe, it, expect, vi } from 'vitest'
import {
  convertModernColorToRgb,
  convertOklchToRgb,
  containsModernColor,
  sanitizeElementColors,
  installColorProxy,
} from '../../infrastructure/pdf/ColorSanitizer'

describe('ColorSanitizer', () => {
  describe('convertModernColorToRgb', () => {
    it('should convert standard oklch color string to rgb', () => {
      // Slate 950 approximation
      const oklch = 'oklch(0.129 0.042 264.695)'
      const rgb = convertModernColorToRgb(oklch)
      expect(rgb).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
      expect(rgb).not.toContain('oklch')
    })

    it('should convert oklab color string to rgb', () => {
      const oklab = 'oklab(0.141 -0.005 0.002)'
      const rgb = convertModernColorToRgb(oklab)
      expect(rgb).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
      expect(rgb).not.toContain('oklab')
    })

    it('should convert oklab with alpha to rgba', () => {
      const oklabWithAlpha = 'oklab(0.5 0.1 -0.1 / 0.75)'
      const rgba = convertModernColorToRgb(oklabWithAlpha)
      expect(rgba).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.75\)$/)
      expect(rgba).not.toContain('oklab')
    })

    it('should convert oklch with alpha and deg hue units', () => {
      const withDecimalAlpha = convertModernColorToRgb('oklch(0.129 0.042 264.695 / 0.5)')
      expect(withDecimalAlpha).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)$/)

      const withPercentAlpha = convertModernColorToRgb('oklch(0.129 0.042 264.695 / 50%)')
      expect(withPercentAlpha).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)$/)

      const withDegHue = convertModernColorToRgb('oklch(0.129 0.042 264.695deg)')
      expect(withDegHue).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
    })

    it('should convert mixed oklab and oklch embedded within CSS gradients', () => {
      const gradient =
        'linear-gradient(135deg, oklab(0.14 -0.01 0.02) 0%, oklch(0.696 0.17 162.48) 100%)'
      const converted = convertModernColorToRgb(gradient)
      expect(converted).not.toContain('oklab')
      expect(converted).not.toContain('oklch')
      expect(converted).toContain('linear-gradient(135deg, rgb(')
    })

    it('should convert color(srgb) strings', () => {
      const colorSrgb = 'color(srgb 0.2 0.4 0.6 / 0.8)'
      const converted = convertModernColorToRgb(colorSrgb)
      expect(converted).not.toContain('color(')
      expect(converted).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.8\)$/)
    })

    it('should preserve standard colors unchanged', () => {
      expect(convertModernColorToRgb('#10b981')).toBe('#10b981')
      expect(convertModernColorToRgb('rgb(16, 185, 129)')).toBe('rgb(16, 185, 129)')
      expect(convertModernColorToRgb('transparent')).toBe('transparent')
    })

    it('should maintain backward compatibility alias convertOklchToRgb', () => {
      expect(convertOklchToRgb('oklab(0.2 0 0)')).toMatch(/^rgb\(/)
    })
  })

  describe('containsModernColor', () => {
    it('should identify strings containing oklch and oklab', () => {
      expect(containsModernColor('oklch(0.5 0.1 180)')).toBe(true)
      expect(containsModernColor('oklab(0.5 0.1 -0.1)')).toBe(true)
      expect(containsModernColor('color(srgb 1 0 0)')).toBe(true)
      expect(containsModernColor('rgb(255, 0, 0)')).toBe(false)
      expect(containsModernColor('#ffffff')).toBe(false)
    })
  })

  describe('sanitizeElementColors', () => {
    it('should sanitize both oklch and oklab from element styles', () => {
      const div = document.createElement('div')
      div.style.backgroundColor = 'oklch(0.129 0.042 264.695)'
      div.style.color = 'oklab(0.9 0 0)'
      document.body.appendChild(div)

      sanitizeElementColors(div)
      expect(div.style.backgroundColor).not.toContain('oklch')
      expect(div.style.color).not.toContain('oklab')
      document.body.removeChild(div)
    })
  })

  describe('installColorProxy', () => {
    it('should intercept getComputedStyle for both oklch and oklab values', () => {
      const doc = document.implementation.createHTMLDocument('test')
      const div = doc.createElement('div')
      doc.body.appendChild(div)

      if (doc.defaultView) {
        doc.defaultView.getComputedStyle = vi.fn().mockReturnValue({
          backgroundColor: 'oklab(0.141 -0.005 0.002)',
          color: 'oklch(0.85 0.05 180)',
        }) as any

        installColorProxy(doc)
        const computed = doc.defaultView.getComputedStyle(div)
        expect(computed.backgroundColor).not.toContain('oklab')
        expect(computed.backgroundColor).toMatch(/^rgb\(/)
        expect(computed.color).not.toContain('oklch')
        expect(computed.color).toMatch(/^rgb\(/)
      }
    })

    it('should allow iterating styles like copyCSSStyles without Illegal invocation error', () => {
      const doc = document.implementation.createHTMLDocument('test')
      const div = doc.createElement('div')
      div.style.color = 'oklab(0.141 -0.005 0.002)'
      doc.body.appendChild(div)

      installColorProxy(doc)

      if (doc.defaultView) {
        const computed = doc.defaultView.getComputedStyle(div)
        expect(typeof computed.length).toBe('number')
        for (let i = 0; i < computed.length; i++) {
          const prop = computed.item(i)
          expect(typeof prop).toBe('string')
        }
        expect(computed.getPropertyValue('color')).not.toContain('oklab')
      }
    })
  })
})
