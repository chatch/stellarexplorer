import { test, expect } from '@playwright/test'
import { clickLinkAndVerify, getFirstLink, verifyOpeningNewPage } from './utils'

const baseUrl = 'https://steexp.com'

test('top page', async ({ page }) => {
  await page.goto(`${baseUrl}/`)
  await expect(page).toHaveTitle('Stellar Explorer | Home')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )
})

test('operations', async ({ page }) => {
  const targetUrl = `${baseUrl}/operations`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Operations')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )

  // Click transaction link
  await page.goto(targetUrl)
  const transactionLink = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    transactionLink,
    'Stellar Explorer | Transaction',
  )
})

test('transactions', async ({ page }) => {
  const targetUrl = `${baseUrl}/txs`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Transactions')

  // Click transaction link
  const transactionLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    transactionLink,
    'Stellar Explorer | Transaction',
  )

  // Click account link
  await page.goto(targetUrl)
  const accountLink = await getFirstLink(page, 1)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )

  // Click ledger link
  await page.goto(targetUrl)
  const ledgerLink = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    ledgerLink,
    'Stellar Explorer | Ledger',
  )
})

test('ledgers', async ({ page }) => {
  const targetUrl = `${baseUrl}/ledgers`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Ledgers')

  // Click ledger link
  const ledgerLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    ledgerLink,
    'Stellar Explorer | Ledger',
  )
})

test('assets', async ({ page, context }) => {
  const targetUrl = `${baseUrl}/assets`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Assets')

  // Click asset link
  const assetLink = await getFirstLink(page, 0)
  await verifyOpeningNewPage(page, context, assetLink)
})

test('anchors', async ({ page }) => {
  const targetUrl = `${baseUrl}/anchors`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Anchors')

  // Click anchors link
  const anchorLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    anchorLink,
    'Stellar Explorer | Anchor',
  )
})

test('exchanges', async ({ page, context }) => {
  const targetUrl = `${baseUrl}/exchanges`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Exchanges')

  // Click asset link
  const exchangeLink = await getFirstLink(page, 0)
  await verifyOpeningNewPage(page, context, exchangeLink)
})

test('effects', async ({ page }) => {
  const targetUrl = `${baseUrl}/effects`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Effects')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )
})

test('payments', async ({ page }) => {
  const targetUrl = `${baseUrl}/payments`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Payments')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )

  // Click transaction link
  await page.goto(targetUrl)
  const transactionLink = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    transactionLink,
    'Stellar Explorer | Transaction',
  )
})

test('trades', async ({ page }) => {
  const targetUrl = `${baseUrl}/trades`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Trades')

  // Click account 1 link
  const account1Link = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    account1Link,
    'Stellar Explorer | Account Balances',
  )

  // Click account 2 link
  await page.goto(targetUrl)
  const account2Link = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    account2Link,
    'Stellar Explorer | Account Balances',
  )
})

test('pools', async ({ page }) => {
  const targetUrl = `${baseUrl}/pools`

  await page.goto(targetUrl)
  await expect(page).toHaveTitle('Stellar Explorer | Liquidity Pools')
})
