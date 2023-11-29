import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://steexp.com/')

  await expect(page).toHaveTitle(/Stellar Explorer/)
})
