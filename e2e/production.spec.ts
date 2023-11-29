import { test, expect } from '@playwright/test'

test('top page', async ({ page }) => {
  await page.goto('https://steexp.com/')
  await expect(page).toHaveTitle('Stellar Explorer | Home')
})

test('operations', async ({ page }) => {
  await page.goto('https://steexp.com/operations')
  await expect(page).toHaveTitle('Stellar Explorer | Operations')
})

test('transactions', async ({ page }) => {
  await page.goto('https://steexp.com/txs')
  await expect(page).toHaveTitle('Stellar Explorer | Transactions')
})

test('ledgers', async ({ page }) => {
  await page.goto('https://steexp.com/ledgers')
  await expect(page).toHaveTitle('Stellar Explorer | Ledgers')
})

test('assets', async ({ page }) => {
  await page.goto('https://steexp.com/assets')
  await expect(page).toHaveTitle('Stellar Explorer | Assets')
})

test('anchors', async ({ page }) => {
  await page.goto('https://steexp.com/anchors')
  await expect(page).toHaveTitle('Stellar Explorer | Anchors')
})

test('exchanges', async ({ page }) => {
  await page.goto('https://steexp.com/exchanges')
  await expect(page).toHaveTitle('Stellar Explorer | Exchanges')
})

test('effects', async ({ page }) => {
  await page.goto('https://steexp.com/effects')
  await expect(page).toHaveTitle('Stellar Explorer | Effects')
})

test('payments', async ({ page }) => {
  await page.goto('https://steexp.com/payments')
  await expect(page).toHaveTitle('Stellar Explorer | Payments')
})

test('trades', async ({ page }) => {
  await page.goto('https://steexp.com/trades')
  await expect(page).toHaveTitle('Stellar Explorer | Trades')
})
