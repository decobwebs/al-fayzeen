// Records a 6 s performance trace of a page (mobile viewport) and lists where main-thread time goes.
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:3200/'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 })
if (process.env.NOVIDEO) await ctx.route(/.(mp4|webm)$/, r => r.abort())
if (process.env.BLOCK) await ctx.route(new RegExp(process.env.BLOCK), r => r.abort())
const page = await ctx.newPage()
if (process.env.STYLE) await page.addInitScript(css => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s) }) }, process.env.STYLE)
await browser.startTracing(page, { path: 'reports/trace.json', categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'blink.user_timing'] })
await page.goto(url, { waitUntil: 'load' })
await page.waitForTimeout(6000)
await browser.stopTracing()
await browser.close()

const { traceEvents } = JSON.parse(readFileSync('reports/trace.json', 'utf8'))
const main = traceEvents.filter(e => e.ph === 'X' && e.name === 'RunTask')
const mainTid = Object.entries(main.reduce((m, e) => ((m[`${e.pid}:${e.tid}`] = (m[`${e.pid}:${e.tid}`] ?? 0) + e.dur), m), {})).sort((a, b) => b[1] - a[1])[0][0]
const [pid, tid] = mainTid.split(':').map(Number)
const evs = traceEvents.filter(e => e.ph === 'X' && e.pid === pid && e.tid === tid)
const by = {}
for (const e of evs) {
  if (e.name === 'RunTask') continue
  const key = e.name === 'FunctionCall' || e.name === 'EvaluateScript' ? `${e.name} ${(e.args?.data?.url ?? '').split('/').pop()}:${e.args?.data?.functionName ?? ''}` : e.name
  by[key] = (by[key] ?? 0) + e.dur / 1000
}
const total = main.filter(e => e.pid === pid && e.tid === tid).reduce((s, e) => s + e.dur / 1000, 0)
console.log(`main thread busy: ${total.toFixed(0)} ms over the trace`)
for (const [k, v] of Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`${v.toFixed(0).padStart(6)} ms  ${k}`)
const frames = traceEvents.filter(e => e.name === 'FireAnimationFrame' && e.pid === pid).length
console.log(`requestAnimationFrame callbacks: ${frames}`)
