// Screenshots of each search tab (and the calendar open) at 390 and 1440. Also checks URL building.
import { chromium } from 'playwright'

const base = process.env.BASE ?? 'http://localhost:3100'
const tabs = ['Umrah Packages', 'Flights', 'Hotels', 'Transport', 'e-Visa']
const browser = await chromium.launch()
const errors = []
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, isMobile: w < 768, hasTouch: w < 768, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`[${w}] ${m.text().slice(0, 240)}`) })
  page.on('pageerror', e => errors.push(`[${w}] pageerror ${e.message}`))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const panel = page.locator('.search-panel')
  for (const [i, name] of tabs.entries()) {
    await page.getByRole('tab', { name }).click()
    await page.waitForTimeout(350)
    if (w < 768) await panel.scrollIntoViewIfNeeded()
    await page.screenshot({ path: `screenshots/p3-tab${i + 1}-${name.replace(/\W+/g, '').toLowerCase()}-${w}.png`, fullPage: w < 768 })
  }
  // calendar: flights depart
  await page.getByRole('tab', { name: 'Flights' }).click()
  await page.locator('#fl-dates').click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `screenshots/p3-calendar-${w}.png`, fullPage: w < 768 })
  await page.keyboard.press('Escape')
  // multi-city
  await page.getByText('Multi-city').click(); await page.waitForTimeout(300)
  await page.screenshot({ path: `screenshots/p3-multicity-${w}.png`, fullPage: w < 768 })
  // travellers popover
  await page.getByRole('button', { name: /Travellers & cabin/ }).click(); await page.waitForTimeout(400)
  await page.screenshot({ path: `screenshots/p3-pax-${w}.png`, fullPage: w < 768 })
  await page.keyboard.press('Escape')

  if (w === 1440) {
    for (const name of tabs) {
      await page.getByRole('tab', { name }).click(); await page.waitForTimeout(200)
      await page.locator('.search-panel button[type=submit]:visible').click()
      await page.waitForURL(u => !u.pathname.endsWith(':3100/') && u.pathname !== '/', { timeout: 5000 }).catch(() => {})
      console.log('→', new URL(page.url()).pathname + new URL(page.url()).search)
      await page.goBack({ waitUntil: 'networkidle' })
    }
  }
  await ctx.close()
}
await browser.close()
if (errors.length) console.log([...new Set(errors)].join('\n'))
