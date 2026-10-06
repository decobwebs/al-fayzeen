// Screenshot helper: node scripts/shot.mjs <path> [name] [--full] [--w=390,1440] [--wait=ms] [--scroll=px] [--click=selector] [--reduced] [--js=code]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const path = args.find(a => !a.startsWith('--')) ?? '/'
const name = args.filter(a => !a.startsWith('--'))[1] ?? (path.replace(/[^\w]+/g, '_').replace(/^_|_$/g, '') || 'home')
const flag = (k, d) => {
  const f = args.find(a => a === `--${k}` || a.startsWith(`--${k}=`))
  if (!f) return d
  const v = f.split('=').slice(1).join('=')
  return v === '' ? true : v
}
const widths = String(flag('w', '390,1440')).split(',').map(Number)
const full = !!flag('full', false)
const wait = Number(flag('wait', 1500))
const scroll = Number(flag('scroll', 0))
const clicks = args.filter(a => a.startsWith('--click=')).map(a => a.slice(8))
const js = flag('js', '')
const base = process.env.BASE ?? 'http://localhost:3100'
const out = flag('out', 'screenshots')
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const errors = []
for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 768 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: flag('reduced', false) ? 'reduce' : 'no-preference',
    hasTouch: w < 768,
    isMobile: w < 768,
  })
  const page = await ctx.newPage()
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`[${w}] ${m.type()}: ${m.text()}`) })
  page.on('pageerror', e => errors.push(`[${w}] pageerror: ${e.message}`))
  await page.goto(base + path, { waitUntil: 'load', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  if (scroll) { await page.mouse.wheel(0, scroll); await page.waitForTimeout(600) }
  for (const c of clicks) { await page.click(c); await page.waitForTimeout(500) }
  if (js) { await page.evaluate(js); await page.waitForTimeout(400) }
  if (full) {
    // walk the page so lazy images and scroll-triggered content load
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120) }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400)
  }
  await page.waitForTimeout(wait)
  const file = `${out}/${name}-${w}.png`
  await page.screenshot({ path: file, fullPage: full })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(`${file}${overflow > 0 ? `  !! horizontal overflow ${overflow}px` : ''}`)
  await ctx.close()
}
await browser.close()
if (errors.length) console.log('Console:\n' + [...new Set(errors)].join('\n'))
