// Local stand-in for a CDN: proxies :3300 → :3200 and brotli/gzip-compresses text responses,
// so Lighthouse measures what Vercel will serve (the Node preview server does not compress HTML).
import http from 'node:http'
import zlib from 'node:zlib'

const target = { host: 'localhost', port: Number(process.env.TARGET ?? 3200) }
http.createServer((req, res) => {
  const p = http.request({ ...target, path: req.url, method: req.method, headers: { ...req.headers, 'accept-encoding': 'identity' } }, (up) => {
    const type = String(up.headers['content-type'] ?? '')
    const compressible = /text|javascript|json|css|svg|xml/.test(type)
    const ae = String(req.headers['accept-encoding'] ?? '')
    const headers = { ...up.headers }
    if (!compressible || up.headers['content-encoding']) {
      res.writeHead(up.statusCode ?? 200, headers)
      return up.pipe(res)
    }
    delete headers['content-length']
    if (ae.includes('br')) {
      headers['content-encoding'] = 'br'
      res.writeHead(up.statusCode ?? 200, headers)
      up.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res)
    }
    else if (ae.includes('gzip')) {
      headers['content-encoding'] = 'gzip'
      res.writeHead(up.statusCode ?? 200, headers)
      up.pipe(zlib.createGzip()).pipe(res)
    }
    else {
      res.writeHead(up.statusCode ?? 200, headers)
      up.pipe(res)
    }
  })
  p.on('error', () => { res.writeHead(502); res.end() })
  req.pipe(p)
}).listen(Number(process.env.PORT ?? 3300), () => console.log('cdn proxy on', process.env.PORT ?? 3300))
