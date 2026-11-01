import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

function terminalLoggerPlugin(): Plugin {
  return {
    name: 'terminal-logger',
    configureServer(server) {
      server.middlewares.use('/__terminal_log', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { level, category, message, details, stack } = JSON.parse(body || '{}')
              const time = new Date().toLocaleTimeString('pt-BR')

              const colors: Record<string, string> = {
                info: '\x1b[36m', // Cyan
                warn: '\x1b[33m', // Yellow
                error: '\x1b[31m\x1b[1m', // Bold Red
                success: '\x1b[32m\x1b[1m', // Bold Green
              }
              const reset = '\x1b[0m'
              const gray = '\x1b[90m'
              const color = colors[level] || colors.info

              console.log(
                `${gray}[${time}]${reset} ${color}[${(level || 'INFO').toUpperCase()}] [${category || 'APP'}] ${message}${reset}`
              )
              if (details) {
                console.log(`${gray}  Detalhes:${reset}`, details)
              }
              if (stack) {
                console.log(`${colors.error}  Stack Trace:${reset}\n${stack}`)
              }

              // Persist log entry to terminal.log for audit and analysis
              try {
                const logFilePath = path.resolve(process.cwd(), 'terminal.log')
                const fileEntry = `[${time}] [${(level || 'INFO').toUpperCase()}] [${category || 'APP'}] ${message}\n${
                  details ? '  Detalhes: ' + JSON.stringify(details, null, 2) + '\n' : ''
                }${stack ? '  Stack Trace:\n' + stack + '\n' : ''}\n`
                fs.appendFileSync(logFilePath, fileEntry, 'utf8')
              } catch (fsErr) {
                console.error('Falha ao gravar no arquivo terminal.log:', fsErr)
              }
            } catch (err) {
              console.error('Falha ao processar log no terminal:', err)
            }
            res.statusCode = 200
            res.end('ok')
          })
        } else if (req.method === 'GET') {
          // Allow reading recent logs
          try {
            const logFilePath = path.resolve(process.cwd(), 'terminal.log')
            if (fs.existsSync(logFilePath)) {
              const content = fs.readFileSync(logFilePath, 'utf8')
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              res.statusCode = 200
              res.end(content)
              return
            }
          } catch {
            // ignore
          }
          res.statusCode = 200
          res.end('Nenhum log gravado ainda.')
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    terminalLoggerPlugin(),
  ],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 15000,
  },
})
