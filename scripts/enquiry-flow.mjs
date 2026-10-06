// Screenshots of the EnquirySheet states and the solid nav after scrolling up.
import { chromium } from 'playwright'

const base = process.env.BASE ?? 'http://localhost:3100'
const browser = await chromium.launch()
const errors = []
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, isMobile: w < 768, hasTouch: w < 768 })
  const page = await ctx.newPage()
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`[${w}] ${m.text().slice(0, 200)}`) })
  page.on('pageerror', e => errors.push(`[${w}] pageerror ${e.message}`))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  // nav solid after scrolling up
  await page.evaluate(() => window.scrollTo(0, 1100)); await page.waitForTimeout(500)
  await page.evaluate(() => window.scrollTo(0, 700)); await page.waitForTimeout(700)
  await page.screenshot({ path: `screenshots/p2-nav-solid-${w}.png` })
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500)

  // mobile menu
  if (w < 768) {
    await page.getByRole('button', { name: 'Menu' }).click(); await page.waitForTimeout(800)
    await page.screenshot({ path: `screenshots/p2-menu-${w}.png` })
    await page.keyboard.press('Escape'); await page.waitForTimeout(400)
  }

  // footer
  const footer = page.locator('footer')
  await footer.scrollIntoViewIfNeeded(); await page.waitForTimeout(500)
  await footer.screenshot({ path: `screenshots/p2-footer-${w}.png` })
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)

  // enquiry: WhatsApp pre-selected (disabled state)
  await page.getByRole('button', { name: 'Chat with us on WhatsApp' }).click(); await page.waitForTimeout(800)
  await page.screenshot({ path: `screenshots/p2-enquiry-wa-${w}.png` })

  // email form
  await page.getByRole('radio', { name: /Email/ }).click(); await page.waitForTimeout(500)
  await page.screenshot({ path: `screenshots/p2-enquiry-email-${w}.png` })

  // error state
  await page.getByRole('button', { name: 'Send enquiry' }).click(); await page.waitForTimeout(500)
  await page.screenshot({ path: `screenshots/p2-enquiry-error-${w}.png` })

  // success
  await page.locator('#enq-name').fill('Aisha Bello')
  await page.locator('#enq-phone').fill('803 123 4567')
  await page.locator('#enq-email').fill('aisha@example.com')
  await page.getByRole('button', { name: 'Send enquiry' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `screenshots/p2-enquiry-sending-${w}.png` })
  await page.getByText(/Your reference is AFZ-/).waitFor({ timeout: 8000 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `screenshots/p2-enquiry-success-${w}.png` })
  console.log(`done ${w}`)
  await ctx.close()
}
await browser.close()
if (errors.length) console.log([...new Set(errors)].join('\n'))
