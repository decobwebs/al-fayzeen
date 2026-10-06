// Full-page screenshots of every route at 390 and 1440, reporting console errors and horizontal overflow.
// node scripts/all-pages.mjs [prefix] [tag]   e.g. node scripts/all-pages.mjs /ar p9
import { chromium } from 'playwright'

const prefix = process.argv[2] ?? ''
const tag = process.argv[3] ?? 'all'
const base = process.env.BASE ?? 'http://localhost:3100'
const routes = ['/', '/packages', '/packages/rahmah', '/flights', '/hotels', '/transport', '/visa', '/guide', '/guide/umrah-step-by-step', '/about', '/contact']
const browser = await chromium.launch()
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, isMobile: w < 768, hasTouch: w < 768, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' })
  const page = await ctx.newPage()
  for (const r of routes) {
    const errs = []
    const onC = m => { if (['error', 'warning'].includes(m.type()) && !/Download the Vue Devtools|\[Vue Router\]/.test(m.text())) errs.push(m.text().slice(0, 160)) }
    const onE = e => errs.push(`pageerror ${e.message.slice(0, 160)}`)
    page.on('console', onC); page.on('pageerror', onE)
    const path = (prefix + r).replace(/\/$/, '') || '/'
    await page.goto(base + path, { waitUntil: 'load', timeout: 90000 })
    await page.evaluate(() => document.fonts.ready)
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 600) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(80) }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(700)
    const name = r === '/' ? 'home' : r.slice(1).replace(/\//g, '-')
    await page.screenshot({ path: `screenshots/${tag}-${name}-${w}.png`, fullPage: true })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    const dir = await page.evaluate(() => document.documentElement.dir)
    console.log(`${w} ${path} dir=${dir}${overflow > 0 ? ` OVERFLOW ${overflow}px` : ''}${errs.length ? `\n   ${[...new Set(errs)].join('\n   ')}` : ''}`)
    page.off('console', onC); page.off('pageerror', onE)
  }
  await ctx.close()
}
await browser.close()
