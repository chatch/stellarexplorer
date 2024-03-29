import type { BrowserContext, Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const getFirstLink = async (
    page: Page,
    columnNum: number,
): Promise<Locator> => {
    let rowNum = 0
    let row = page.locator('tbody tr').nth(rowNum)
    while (await row.locator('td').nth(columnNum).locator('a').isHidden()) {
        rowNum++
        row = page.locator('tbody tr').nth(rowNum)
    }

    return row.locator('td').nth(columnNum).locator('a')
}

export const getRowCount = async (
    page: Page,
    tableId: string
): Promise<number> => {
    const tableSelector = `table#${tableId} tbody tr`
    await page.waitForSelector(tableSelector)
    return page.locator(tableSelector).count()
}

export const clickLinkAndVerify = async (
    baseUrl: string,
    page: Page,
    linkLocator: Locator,
    title: string,
): Promise<void> => {
    const linkUrl = (await linkLocator.getAttribute('href')) || ''
    const expectedText = linkUrl?.split('/').pop()
    const expectedTitle = `${title} ${expectedText}`
    await linkLocator.click()
    await page.waitForTimeout(3000)
    const expectedUrl = new URL(linkUrl, baseUrl).toString()
    expect(page.url()).toBe(expectedUrl)

    await expect(page).toHaveTitle(expectedTitle)
    expect(await page.textContent('body')).toContain(expectedText)
}

export const verifyOpeningNewPage = async (
    page: Page,
    context: BrowserContext,
    linkLocator: Locator,
): Promise<void> => {
    const linkUrl = await linkLocator.getAttribute('href')

    await linkLocator.click()
    await page.waitForTimeout(3000)
    const allPages = context.pages()
    const allPageUrls = allPages.map((p: Page) => p.url())
    expect(allPageUrls.includes(`${linkUrl}/`)).toBeTruthy()
}
