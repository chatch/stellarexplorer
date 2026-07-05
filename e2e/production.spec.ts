import { test, expect } from '@playwright/test'
import type { APIRequestContext } from '@playwright/test'
import {
  clickLinkAndVerify,
  getFirstLink,
  getRowCount,
  gotoAndWaitForTitle,
  verifyOpeningNewPage,
} from './utils'

// const baseUrl = 'http://localhost:4173'
const baseUrl = 'https://steexp.com'
const horizonUrl = 'https://horizon.stellar.org'

type ClaimableBalanceRecord = {
  sponsor?: string
  claimants?: Array<{
    destination?: string
  }>
}

const getLiveClaimableBalanceAccounts = async (
  request: APIRequestContext,
): Promise<{ claimant: string; sponsor: string }> => {
  const response = await request.get(
    `${horizonUrl}/claimable_balances?limit=50&order=desc`,
  )
  expect(response.ok()).toBeTruthy()

  const body = await response.json()
  const records = (body._embedded?.records ?? []) as ClaimableBalanceRecord[]
  const record = records.find(
    ({ sponsor, claimants }) => sponsor && claimants?.[0]?.destination,
  )

  if (!record?.sponsor || !record.claimants?.[0]?.destination) {
    throw new Error('No live claimable balance with sponsor and claimant found')
  }

  return {
    claimant: record.claimants[0].destination,
    sponsor: record.sponsor,
  }
}

test.beforeEach(async ({ page: _page }, testInfo) => {
  console.log(`Running test: ${testInfo.title}`)
})

test('top page', async ({ page }) => {
  await gotoAndWaitForTitle(page, `${baseUrl}/`, 'Stellar Explorer | Home')

  expect(await getRowCount(page, `operation-table`)).toEqual(25)
  expect(await getRowCount(page, `transaction-table`)).toEqual(10)
  expect(await getRowCount(page, `ledger-table`)).toEqual(10)
})

test('operations', async ({ page }) => {
  const targetUrl = `${baseUrl}/operations`

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Operations')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )

  // Click transaction link
  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Operations')
  const transactionLink = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    transactionLink,
    'Stellar Explorer | Transaction',
  )
})

test('transactions', async ({ page }) => {
  await gotoAndWaitForTitle(
    page,
    `${baseUrl}/txs`,
    'Stellar Explorer | Transactions',
  )
  expect(await getRowCount(page, `transaction-table`)).toEqual(20)
})

test('ledgers', async ({ page }) => {
  const targetUrl = `${baseUrl}/ledgers`

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Ledgers')

  // Click ledger link
  const ledgerLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    ledgerLink,
    'Stellar Explorer | Ledger',
  )
})

test('assets', async ({ page }) => {
  await gotoAndWaitForTitle(
    page,
    `${baseUrl}/assets`,
    'Stellar Explorer | Assets',
  )
  expect(await getRowCount(page, `assets-table`)).toEqual(50)
})

test('anchors', async ({ page }) => {
  const targetUrl = `${baseUrl}/anchors`

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Anchors')

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

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Exchanges')

  // Click asset link
  const exchangeLink = await getFirstLink(page, 0)
  await verifyOpeningNewPage(page, context, exchangeLink)
})

test('effects', async ({ page }) => {
  const targetUrl = `${baseUrl}/effects`

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Effects')

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

  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Payments')

  // Click account link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Account Balances',
  )

  // Click transaction link
  await gotoAndWaitForTitle(page, targetUrl, 'Stellar Explorer | Payments')
  const transactionLink = await getFirstLink(page, 2)
  await clickLinkAndVerify(
    baseUrl,
    page,
    transactionLink,
    'Stellar Explorer | Transaction',
  )
})

test('trades', async ({ page }) => {
  await gotoAndWaitForTitle(
    page,
    `${baseUrl}/trades`,
    'Stellar Explorer | Trades',
  )
  expect(await getRowCount(page, `trade-table`)).toEqual(20)
})

test('pools', async ({ page }) => {
  const targetUrl = `${baseUrl}/pools`

  await gotoAndWaitForTitle(
    page,
    targetUrl,
    'Stellar Explorer | Liquidity Pools',
  )

  // Click pool link
  const accountLink = await getFirstLink(page, 0)
  await clickLinkAndVerify(
    baseUrl,
    page,
    accountLink,
    'Stellar Explorer | Effects for Liquidity Pool',
  )
})

test('claimable-balances', async ({ page, request }) => {
  const targetUrl = `${baseUrl}/claimable-balances`
  const { claimant, sponsor } = await getLiveClaimableBalanceAccounts(request)

  await gotoAndWaitForTitle(
    page,
    targetUrl,
    'Stellar Explorer | Claimable Balances',
  )

  // Execute search
  const searchInput = page.getByPlaceholder('Search by Account')
  await searchInput.fill(claimant)
  await searchInput.press('Enter')

  await expect(
    page.getByRole('columnheader', { name: 'Sponsor' }),
  ).toBeVisible()

  await gotoAndWaitForTitle(
    page,
    targetUrl,
    'Stellar Explorer | Claimable Balances',
  )
  await page.getByPlaceholder('Search by Account').fill(sponsor)
  await page.getByPlaceholder('Search by Account').press('Enter')
  await page.getByRole('tab', { name: 'Sponsor' }).click()
  await expect(
    page.getByRole('columnheader', { name: 'Claimant' }),
  ).toBeVisible()
})
