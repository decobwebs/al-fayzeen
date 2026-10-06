// axe-core accessibility scan of every route (WCAG 2.x A/AA), English and Arabic.
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = process.env.BASE ?? 'http://localhost:3100'
const routes = ['/', '/packages', '/packages/rahmah', '/flights', '/hotels', '/transport', '/visa', '/guide', '/guide/umrah-step-by-step', '/about', '/contact']
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const page = await ctx.newPage()
let total = 0
for (const prefix of ['', '/ar']) {
  for (const r of routes) {
    const path = (prefix + r).replace(/\/$/, '') || '/'
    await page.goto(base + path, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(2500)
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    total += res.violations.length
    console.log(`${path}: ${res.violations.length ? res.violations.map(v => `${v.id} (${v.nodes.length})`).join(', ') : 'no violations'}`)
    for (const v of res.violations) for (const n of v.nodes.slice(0, 3)) console.log(`   ${v.id}: ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`.slice(0, 260))
  }
}
await browser.close()
console.log(`total violation types: ${total}`)
