// node scripts/lh.mjs <url> <name>  → reports/lh-<name>.json + a short summary (mobile, simulated Fast 4G / mid-tier CPU)
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'

const [url = 'http://localhost:3200/', name = 'home'] = process.argv.slice(2)
mkdirSync('reports', { recursive: true })
const out = `reports/lh-${name}.json`
const chrome = process.env.CHROME_PATH ?? 'C:/Users/HP/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
try {
  execFileSync(process.execPath, ['node_modules/lighthouse/cli/index.js', url,
    '--form-factor=mobile', '--throttling-method=simulate', '--only-categories=performance,accessibility,best-practices,seo',
    '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox', '--quiet'], { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chrome } })
}
catch { /* lighthouse exits non-zero on Windows temp cleanup; the report is still written */ }

const r = JSON.parse(readFileSync(out, 'utf8'))
const a = r.audits
const c = r.categories
console.log(`${name}: perf ${Math.round(c.performance.score * 100)} · a11y ${Math.round(c.accessibility.score * 100)} · best ${Math.round(c['best-practices'].score * 100)} · seo ${Math.round(c.seo.score * 100)}`)
for (const k of ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index']) console.log(`  ${k}: ${a[k].displayValue}`)
const reqs = a['network-requests'].details.items
const js = reqs.filter(i => i.resourceType === 'Script')
console.log(`  JS transferred: ${(js.reduce((s, i) => s + i.transferSize, 0) / 1024).toFixed(1)} KB in ${js.length} files`)
const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet
if (lcpEl) console.log(`  LCP element: ${lcpEl.slice(0, 160)}`)
for (const cat of ['accessibility', 'best-practices', 'seo']) {
  for (const ref of c[cat].auditRefs) {
    const au = a[ref.id]
    if (au.score !== null && au.score < 1 && ref.weight > 0) console.log(`  [${cat}] ${au.title}`)
  }
}
for (const id of ['render-blocking-insight', 'render-blocking-resources', 'unused-javascript', 'lcp-discovery-insight', 'lcp-phases-insight', 'document-latency-insight']) {
  if (a[id] && a[id].score !== null && a[id].score < 0.9) console.log(`  [perf] ${a[id].title} ${a[id].displayValue ?? ''}`)
}
