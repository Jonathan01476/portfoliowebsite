// Local preview for the static production build; deployment uses the host's CDN.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../out')
const port = Number(process.env.PORT || 3000)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' }
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run the build before starting the production preview.')
http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end() }
  let pathname
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { res.writeHead(400); return res.end() }
  const candidate = path.resolve(root, '.' + pathname)
  const relative = path.relative(root, candidate)
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(/[\\/]/).some(part => part.startsWith('.')) || pathname.includes('\0')) { res.writeHead(403); return res.end() }
  const options = [candidate, path.join(candidate, 'index.html'), candidate + '.html']
  const file = options.find(file => { try { return fs.statSync(file).isFile() } catch { return false } })
  if (!file) { res.writeHead(404); return res.end('Not found') }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' })
  if (req.method === 'HEAD') return res.end()
  fs.createReadStream(file).on('error', () => res.destroy()).pipe(res)
}).listen(port, '127.0.0.1', () => console.log('Production preview: http://localhost:' + port))
