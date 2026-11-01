import fs from 'node:fs'
import path from 'node:path'

const filesToPatch = [
  'node_modules/html2canvas/dist/html2canvas.js',
  'node_modules/html2canvas/dist/html2canvas.esm.js',
  'node_modules/html2canvas/dist/lib/css/types/color.js',
  'node_modules/.vite/deps/html2canvas.js',
]

let patchedCount = 0

for (const relPath of filesToPatch) {
  const fullPath = path.resolve(process.cwd(), relPath)
  if (!fs.existsSync(fullPath)) continue

  let content = fs.readFileSync(fullPath, 'utf8')
  const original = content

  // Replace throwing unsupported color function with safe transparent fallback
  content = content.replace(
    /throw new Error\([^)]*unsupported color function[^)]*\);?/g,
    'return (typeof COLORS !== "undefined" && COLORS.TRANSPARENT) ? COLORS.TRANSPARENT : (typeof exports !== "undefined" && exports.COLORS) ? exports.COLORS.TRANSPARENT : 0;'
  )

  // Fix Tailwind preflight setting img { display: block } which corrupts FontMetrics baseline calculation
  content = content.replace(
    /img\.style\.verticalAlign\s*=\s*(['"])baseline\1;?/g,
    'img.style.verticalAlign = $1baseline$1; img.style.display = $1inline$1;'
  )

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`[Gymfloor Patch] Patched html2canvas color guard in: ${relPath}`)
    patchedCount++
  }
}

console.log(`[Gymfloor Patch] Done. Patched ${patchedCount} html2canvas files.`)
