// Keyboard-only walk-through: home search (Flights tab) → results → Enquire → email form → success.
import { chromium } from 'playwright'

const base = process.env.BASE ?? 'http://localhost:3100'
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const focused = () => page.evaluate(() => {
  const e = document.activeElement
  return `${e?.tagName.toLowerCase()}${e?.getAttribute('role') ? `[role=${e.getAttribute('role')}]` : ''} "${(e?.getAttribute('aria-label') || e?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)}"`
})
async function tabUntil(test, max = 80, key = 'Tab') {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key)
    const f = await focused()
    if (test(f)) return f
  }
  throw new Error(`not reached; last focus ${await focused()}`)
}
const step = (s) => console.log(`✓ ${s}`)

await page.goto(base + '/', { waitUntil: 'load' })
await page.waitForTimeout(6000) // dev hydration

// 1. skip link is the first stop
await page.keyboard.press('Tab')
step(`first Tab → ${await focused()}`)

// 2. reach the search tabs, move to Flights with the arrow key, activate with Enter
await tabUntil(f => f.includes('[role=tab]') && f.includes('Umrah Packages'))
await page.keyboard.press('ArrowRight')
await page.keyboard.press('Enter')
step(`search tab → ${await focused()}`)

// 3. reach the submit button and press Enter
await tabUntil(f => f.includes('Search flights'))
await page.keyboard.press('Enter')
await page.waitForURL(/\/flights/, { timeout: 15000 })
await page.waitForTimeout(5000)
step(`results page → ${new URL(page.url()).pathname}${new URL(page.url()).search.slice(0, 60)}…`)

// 4. first result's Enquire
await tabUntil(f => f.startsWith('button') && f.includes('"Enquire"'), 150)
await page.keyboard.press('Enter')
await page.waitForTimeout(900)
const dialogOpen = await page.evaluate(() => !!document.querySelector('[role=dialog]'))
step(`Enquire → sheet open: ${dialogOpen}; focus ${await focused()}`)

// 5. choose Email (radio cards), fill the form by keyboard only
await tabUntil(f => f.includes('[role=radio]') && f.includes('Email'), 30)
await page.keyboard.press('Enter')
await page.waitForTimeout(400)
await tabUntil(f => f.startsWith('input') || f.includes('Full name'), 10)
await page.keyboard.type('Aisha Bello')
await page.keyboard.press('Tab') // dial code
await page.keyboard.press('Tab') // phone
await page.keyboard.type('8031234567')
await page.keyboard.press('Tab') // email
await page.keyboard.type('aisha@example.com')
await tabUntil(f => f.includes('Send enquiry'), 10)
await page.keyboard.press('Enter')
await page.getByText(/Your reference is AFZ-/).waitFor({ timeout: 10000 })
step('email enquiry sent by keyboard → success with AFZ reference')

// 6. Escape closes the sheet and returns focus
await page.keyboard.press('Escape')
await page.waitForTimeout(500)
step(`Escape → sheet closed: ${await page.evaluate(() => !document.querySelector('[role=dialog]'))}; focus back on ${await focused()}`)
await browser.close()
