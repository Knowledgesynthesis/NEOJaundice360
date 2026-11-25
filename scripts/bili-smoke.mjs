import assert from 'node:assert/strict'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const origin = process.env.BILI_BASE_URL || 'http://127.0.0.1:4173'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' })
  page.setDefaultTimeout(5000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const route = async (path, state = {}) => {
    const url = new URL(path, origin)
    for (const [key, value] of Object.entries(state)) url.searchParams.set(key, String(value))
    if (process.env.BILI_LIVE_SMOKE === 'true') url.searchParams.set('verify', `${process.env.GITHUB_SHA}-${Date.now()}`)
    assert.equal((await page.goto(url.href, { waitUntil: 'domcontentloaded' }))?.status(), 200)
  }
  const result = page.locator('#calc-results')
  const get = (text) => result.getByText(text, { exact: typeof text === 'string' })
  await route('/calculator', { ga: 35, m: '48:16:TSB' })
  await get('Phototherapy indicated').waitFor()
  for (const n of ['14.2 mg/dL', '18.7 mg/dL', '20.7 mg/dL']) await get(n).waitFor()
  await get('AAP hour 48').first().waitFor()
  assert.ok(await result.locator('svg').count())

  await route('/calculator', { ga: 39, m: '80:31:TcB', alb: '2.9' })
  await get('TcB screening only — treatment decisions require TSB').waitFor()
  await get(/Obtain serum TSB now/).waitFor()
  assert.equal(await get(/Start intensive phototherapy|Escalation of care is a medical emergency|prepare for urgent exchange|Bilirubin \/ albumin ratio/).count(), 0)

  await route('/calculator', { ga: 40, m: '96:21.6:TSB' })
  await get('Below phototherapy threshold').waitFor()
  await page.getByRole('checkbox', { name: /TSB rising despite ongoing phototherapy/ }).click()
  await get('ESCALATION OF CARE — emergency').waitFor()
  for (const n of ['21.8 mg/dL', '21.5 mg/dL', '23.5 mg/dL']) await get(n).waitFor()
  await get(/start IV hydration/).waitFor()
  await get(/rising TSB despite phototherapy \(Table 4\)/).waitFor()

  await route('/calculator', { ga: 38, m: '', abe: 1 })
  await result.getByRole('alert').getByText('ABE signs — urgent exchange transfusion').waitFor()
  await get(/do not wait for a bilirubin result/).waitFor()

  await route('/calculator', { ga: 34, m: '36:10:TSB' })
  await get(/Preterm <35 weeks/).waitFor()
  assert.equal(await get('AAP hour 36').count(), 0)
  for (const age of [0, 337]) {
    await route('/calculator', { ga: 39, m: `${age}:20:TSB` })
    await get('Threshold not computed for this input').waitFor()
    assert.equal(await get(/Start intensive phototherapy|Escalation of care is a medical emergency/).count(), 0)
  }

  await route('/cases/intake')
  await page.getByRole('button', { name: /Follow-up within 2 days; TcB\/TSB per clinical judgment/ }).click()
  await page.getByText(/Screening only\. Use TSB for treatment decisions/).waitFor()
  await page.getByRole('link', { name: 'Open in calculator' }).click()
  await get('TcB screening only — treatment decisions require TSB').waitFor()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(errors, [])
  console.log(`Bilirubin browser smoke passed: ${origin}/calculator and linked cases`)
} finally {
  await browser.close()
}
