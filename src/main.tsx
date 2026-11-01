import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Logger } from './infrastructure/logger/Logger.ts'
import { patchWindowGetComputedStyle } from './infrastructure/pdf/ColorSanitizer.ts'

Logger.init()
patchWindowGetComputedStyle()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
