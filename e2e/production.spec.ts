import { test, expect } from '@playwright/test'
import { clickLinkAndVerify, getFirstLink, getRowCount, verifyOpeningNewPage } from './utils'

const baseUrl = 'https://steexp.com'
// const baseUrl = 'http://publicnet.local:3000' // for test on local

test('top page', async ({ page }) => {
    await page.goto(`${baseUrl}/`)

    expect(await getRowCount(page, `operation-table`)).toEqual(25)
    expect(await getRowCount(page, `transaction-table`)).toEqual(10)
    expect(await getRowCount(page, `ledger-table`)).toEqual(10)

    await expect(page).toHaveTitle('Stellar Explorer | Home')
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
    expect(await getRowCount(page, `transaction-table`)).toEqual(20)
    await expect(page).toHaveTitle('Stellar Explorer | Transactions')
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

    expect(await getRowCount(page, `assets-table`)).toEqual(50)
    await expect(page).toHaveTitle('Stellar Explorer | Assets')
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
    expect(await getRowCount(page, `trade-table`)).toEqual(20)
    await expect(page).toHaveTitle('Stellar Explorer | Trades')
})

test('pools', async ({ page }) => {
    const targetUrl = `${baseUrl}/pools`

    await page.goto(targetUrl)
    await expect(page).toHaveTitle('Stellar Explorer | Liquidity Pools')

    // Click pool link
    const accountLink = await getFirstLink(page, 0)
    await clickLinkAndVerify(
        baseUrl,
        page,
        accountLink,
        'Stellar Explorer | Effects for Liquidity Pool',
    )
})

test('claimable-balances', async ({ page }) => {
    const targetUrl = `${baseUrl}/claimable-balances`

    await page.goto(targetUrl)
    await expect(page).toHaveTitle('Stellar Explorer | Claimable Balances')

    // Execute search
    const searchInput = page.getByPlaceholder('Search by Account')
    await searchInput.fill(
        // arbitrary address is used
        'GB5YEYTFL2VKQTY34XUTYAS24BGNHHEUEGNLPMQZNJULGCZ2C5UIBMLC',
    )
    await searchInput.press('Enter')

    await page.getByRole('tab', { name: 'Sponsor' }).click()
    await expect(page.getByRole('cell', { name: 'Claimant' })).toBeVisible()
    await page.getByRole('tab', { name: 'Claimant' }).click()
    await expect(page.getByRole('cell', { name: 'Sponsor' })).toBeVisible()
})
