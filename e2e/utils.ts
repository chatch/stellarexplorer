import type { BrowserContext, Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import pRetry from 'p-retry'

// Max time to wait for any single network/navigation action (10s).
// If exceeded, we cancel and retry rather than hanging.
const ACTION_TIMEOUT = 10_000

/**
 * Navigate to a URL, wait for the page to fully load, and assert the title.
 * Uses a short timeout with retries so we fail fast and retry instead of
 * waiting indefinitely.
 */
export const gotoAndWaitForTitle = async (
  page: Page,
  url: string,
  expectedTitle: string,
): Promise<void> => {
  await pRetry(
    async () => {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: ACTION_TIMEOUT,
      })
      await expect(page).toHaveTitle(expectedTitle, {
        timeout: ACTION_TIMEOUT,
      })
    },
    {
      retries: 2,
      onFailedAttempt: (error) => {
        console.log(
          `gotoAndWaitForTitle attempt ${error.attemptNumber} failed for ${url}: ${error.message}. Retrying...`,
        )
      },
    },
  )
}

export const getFirstLink = async (
  page: Page,
  columnNum: number,
): Promise<Locator> => {
  // Wait for the table to actually render rows before scanning
  await page.waitForSelector('tbody tr', { timeout: ACTION_TIMEOUT })

  let rowNum = 0
  let row = page.locator('tbody tr').nth(rowNum)
  while (await row.locator('td').nth(columnNum).locator('a').isHidden()) {
    rowNum++
    row = page.locator('tbody tr').nth(rowNum)
  }

  const link = row.locator('td').nth(columnNum).locator('a')
  console.log(`Found link at row ${rowNum}, col ${columnNum}: ${await link.getAttribute('href')}`)
  return link
}

export const getRowCount = async (
  page: Page,
  tableId: string,
): Promise<number> => {
  const tableSelector = `table#${tableId} tbody tr`
  await page.waitForSelector(tableSelector, { timeout: ACTION_TIMEOUT })
  return page.locator(tableSelector).count()
}

export const clickLinkAndVerify = async (
  baseUrl: string,
  page: Page,
  linkLocator: Locator,
  title: string,
): Promise<void> => {
  const linkUrl = (await linkLocator.getAttribute('href')) || ''
  const target = await linkLocator.getAttribute('target')

  if (target === '_blank') {
    throw new Error(
      `clickLinkAndVerify called on a link with target="_blank" (${linkUrl}). Use verifyOpeningNewPage instead.`,
    )
  }

  const expectedText = linkUrl?.split('/').pop()
  const expectedTitle = `${title} ${expectedText}`

  // Save the source URL so retries can navigate back
  const sourceUrl = page.url()

  await pRetry(
    async () => {
      // On retry, go back to the source page first
      if (page.url() !== sourceUrl) {
        console.log(`Retry: navigating back to source page ${sourceUrl}`)
        await page.goto(sourceUrl, {
          waitUntil: 'domcontentloaded',
          timeout: ACTION_TIMEOUT,
        })
        // Re-wait for table so the link locator is valid again
        await page.waitForSelector('tbody tr', { timeout: ACTION_TIMEOUT })
      }

      console.log(`Clicking link: ${linkUrl} (target: ${target || 'self'})`)
      await linkLocator.click()

      console.log(`Waiting for URL containing: ${linkUrl}`)
      await page.waitForURL((url) => url.toString().includes(linkUrl), {
        timeout: ACTION_TIMEOUT,
      })
    },
    {
      retries: 2,
      onFailedAttempt: (error) => {
        console.log(
          `clickLinkAndVerify attempt ${error.attemptNumber} failed: ${error.message}. Retrying...`,
        )
      },
    },
  )
  console.log(`Navigated to: ${page.url()}`)

  expect(page.url()).toContain(linkUrl)
  await expect(page).toHaveTitle(expectedTitle, { timeout: ACTION_TIMEOUT })

  // Use a locator check instead of page.textContent('body') which can be flaky/heavy
  await expect(page.locator('body')).toContainText(expectedText || '', {
    timeout: ACTION_TIMEOUT,
  })
}

export const verifyOpeningNewPage = async (
  page: Page,
  context: BrowserContext,
  linkLocator: Locator,
): Promise<void> => {
  const linkUrl = await linkLocator.getAttribute('href')
  const target = await linkLocator.getAttribute('target')

  if (!linkUrl) {
    throw new Error(`Link not found or has no href: ${linkLocator}`)
  }

  console.log(`Clicking link: ${linkUrl} (target: ${target})`)

  if (target === '_blank') {
    const pagePromise = context.waitForEvent('page', {
      timeout: ACTION_TIMEOUT,
    })
    await linkLocator.click()
    const newPage = await pagePromise

    await newPage.waitForLoadState('domcontentloaded', {
      timeout: ACTION_TIMEOUT,
    })
    const newPageUrl = newPage.url()
    console.log(`New page opened with URL: ${newPageUrl}`)
    expect(newPageUrl).toContain(linkUrl)
  } else {
    console.log(
      'Link does not target _blank, waiting for navigation on current page...',
    )
    await linkLocator.click()

    await page.waitForURL((url) => url.toString().includes(linkUrl), {
      timeout: ACTION_TIMEOUT,
    })
    console.log(`Navigated to: ${page.url()}`)
  }
}
