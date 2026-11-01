/**
 * Utility to convert modern CSS color functions (oklch, oklab, lab, lch, color, etc.)
 * into standard sRGB rgb(...)/rgba(...) strings.
 *
 * This completely fixes html2canvas's fatal failures:
 * - "Attempting to parse an unsupported color function 'oklch'"
 * - "Attempting to parse an unsupported color function 'oklab'"
 */

/**
 * Mathematical conversion from OKLab (L, a, b) with alpha to sRGB rgb/rgba string.
 */
export function oklabToRgb(L: number, a: number, b: number, A: number = 1): string {
  // 1. Nonlinear OKLab to LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  // 2. Linear LMS
  const lVal = l_ ** 3
  const mVal = m_ ** 3
  const sVal = s_ ** 3

  // 3. LMS to linear sRGB
  const rLin = +4.0767434772 * lVal - 3.3077115913 * mVal + 0.2309699292 * sVal
  const gLin = -1.2684380046 * lVal + 2.6097574011 * mVal - 0.3413193965 * sVal
  const bLin = -0.0041960863 * lVal - 0.7034186147 * mVal + 1.707614701 * sVal

  // 4. sRGB Gamma companding
  const gamma = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055

  const r = Math.min(255, Math.max(0, Math.round(gamma(rLin) * 255)))
  const g = Math.min(255, Math.max(0, Math.round(gamma(gLin) * 255)))
  const bVal = Math.min(255, Math.max(0, Math.round(gamma(bLin) * 255)))

  return A < 1
    ? `rgba(${r}, ${g}, ${bVal}, ${A})`
    : `rgb(${r}, ${g}, ${bVal})`
}

/**
 * Checks if a string contains modern unsupported CSS color functions.
 */
export function containsModernColor(str: unknown): boolean {
  if (typeof str !== 'string') return false
  return /(?:oklch|oklab|lab|lch|color|color-mix|hwb)\(/i.test(str)
}

let cachedCanvasCtx: CanvasRenderingContext2D | null = null

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  if (!cachedCanvasCtx) {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      cachedCanvasCtx = canvas.getContext('2d')
    } catch {
      return null
    }
  }
  return cachedCanvasCtx
}

/**
 * Converts any modern CSS color string (oklch, oklab, color, etc.) to standard sRGB rgb/rgba.
 */
export function convertModernColorToRgb(str: string): string {
  if (typeof str !== 'string' || !containsModernColor(str)) return str

  let result = str

  // 1. Replace oklch(...)
  result = result.replace(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.deg%]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,
    (_match, LStr, CStr, HStr, AStr) => {
      let L = parseFloat(LStr)
      if (LStr.endsWith('%')) L /= 100

      let C = parseFloat(CStr)
      if (CStr.endsWith('%')) C = (C / 100) * 0.4

      const H = parseFloat(HStr)

      let A = 1
      if (AStr) {
        A = parseFloat(AStr)
        if (AStr.endsWith('%')) A /= 100
      }

      const hRad = (H * Math.PI) / 180
      const a = C * Math.cos(hRad)
      const b = C * Math.sin(hRad)

      return oklabToRgb(L, a, b, A)
    }
  )

  // 2. Replace oklab(...)
  result = result.replace(
    /oklab\(\s*([+-]?[\d.]+%?)\s+([+-]?[\d.]+%?)\s+([+-]?[\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,
    (_match, LStr, aStr, bStr, AStr) => {
      let L = parseFloat(LStr)
      if (LStr.endsWith('%')) L /= 100

      let a = parseFloat(aStr)
      if (aStr.endsWith('%')) a = (a / 100) * 0.4

      let b = parseFloat(bStr)
      if (bStr.endsWith('%')) b = (b / 100) * 0.4

      let A = 1
      if (AStr) {
        A = parseFloat(AStr)
        if (AStr.endsWith('%')) A /= 100
      }

      return oklabToRgb(L, a, b, A)
    }
  )

  // 3. Replace color(srgb R G B [/ A])
  result = result.replace(
    /color\(\s*srgb\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,
    (_match, rStr, gStr, bStr, aStr) => {
      let r = parseFloat(rStr)
      if (rStr.endsWith('%')) r /= 100
      let g = parseFloat(gStr)
      if (gStr.endsWith('%')) g /= 100
      let b = parseFloat(bStr)
      if (bStr.endsWith('%')) b /= 100

      let a = 1
      if (aStr) {
        a = parseFloat(aStr)
        if (aStr.endsWith('%')) a /= 100
      }

      const r255 = Math.min(255, Math.max(0, Math.round(r * 255)))
      const g255 = Math.min(255, Math.max(0, Math.round(g * 255)))
      const b255 = Math.min(255, Math.max(0, Math.round(b * 255)))

      return a < 1
        ? `rgba(${r255}, ${g255}, ${b255}, ${a})`
        : `rgb(${r255}, ${g255}, ${b255})`
    }
  )

  // 4. Any remaining modern color functions: attempt browser canvas parsing if applicable
  if (containsModernColor(result)) {
    const ctx = getCanvasContext()
    if (ctx) {
      result = result.replace(
        /(?:lab|lch|color|color-mix|hwb)\([^)]+\)/gi,
        (match) => {
          try {
            ctx.fillStyle = '#123456'
            ctx.fillStyle = match
            const parsed = ctx.fillStyle
            if (parsed && parsed !== '#123456' && !containsModernColor(parsed)) {
              return parsed
            }
          } catch {
            // fallback
          }
          return 'rgba(0, 0, 0, 0)'
        }
      )
    }
  }

  return result
}

/**
 * Backward compatibility alias for existing code references.
 */
export const convertOklchToRgb = convertModernColorToRgb

/**
 * Traverses all elements in the DOM container and assigns explicit standard rgb/hex inline styles
 * for any computed or inline properties containing modern color functions.
 */
export function sanitizeElementColors(root: HTMLElement): void {
  if (typeof window === 'undefined') return

  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]

  for (const el of elements) {
    try {
      const computed = window.getComputedStyle(el)

      const bg = computed.backgroundColor
      if (containsModernColor(bg)) {
        el.style.backgroundColor = convertModernColorToRgb(bg)
      }

      const bgImg = computed.backgroundImage
      if (containsModernColor(bgImg)) {
        el.style.backgroundImage = convertModernColorToRgb(bgImg)
      }

      const color = computed.color
      if (containsModernColor(color)) {
        el.style.color = convertModernColorToRgb(color)
      }

      const borderTop = computed.borderTopColor
      if (containsModernColor(borderTop)) {
        el.style.borderTopColor = convertModernColorToRgb(borderTop)
        el.style.borderRightColor = convertModernColorToRgb(computed.borderRightColor)
        el.style.borderBottomColor = convertModernColorToRgb(computed.borderBottomColor)
        el.style.borderLeftColor = convertModernColorToRgb(computed.borderLeftColor)
      }

      const outline = computed.outlineColor
      if (containsModernColor(outline)) {
        el.style.outlineColor = convertModernColorToRgb(outline)
      }

      const shadow = computed.boxShadow
      if (containsModernColor(shadow)) {
        el.style.boxShadow = convertModernColorToRgb(shadow)
      }

      const txtShadow = computed.textShadow
      if (containsModernColor(txtShadow)) {
        el.style.textShadow = convertModernColorToRgb(txtShadow)
      }

      const fill = (el as any).style?.fill || computed.fill
      if (containsModernColor(fill)) {
        el.style.fill = convertModernColorToRgb(fill)
      }

      const stroke = (el as any).style?.stroke || computed.stroke
      if (containsModernColor(stroke)) {
        el.style.stroke = convertModernColorToRgb(stroke)
      }
    } catch {
      // Ignore detached elements or uncomputable styles
    }
  }
}

/**
 * Patches window.getComputedStyle on any target window (main window or cloned iframe)
 * so that any property containing modern color functions is automatically returned as standard sRGB.
 */
export function patchWindowGetComputedStyle(win: Window = window): void {
  if (!win || (win as any).__gymfloor_color_patched) return

  const originalGetComputedStyle = win.getComputedStyle
  win.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
    const style = originalGetComputedStyle.call(win, elt, pseudoElt)

    return new Proxy(style, {
      get(target, prop) {
        if (prop === 'getPropertyValue') {
          return (propertyName: string) => {
            const raw = target.getPropertyValue(propertyName)
            return containsModernColor(raw) ? convertModernColorToRgb(raw) : raw
          }
        }
        if (prop === 'item') {
          return (index: number) => target.item(index)
        }

        const val = (target as any)[prop]
        if (typeof val === 'function') {
          return val.bind(target)
        }
        if (containsModernColor(val)) {
          return convertModernColorToRgb(val)
        }
        return val
      },
    })
  }

  ;(win as any).__gymfloor_color_patched = true
}

/**
 * Patches window.getComputedStyle in the cloned document so html2canvas never receives an unsupported color string.
 */
export function installColorProxy(doc: Document): void {
  const win = doc.defaultView
  if (win) {
    patchWindowGetComputedStyle(win)
  }
}
