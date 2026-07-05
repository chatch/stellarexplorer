import fs from 'fs'
import path from 'path'

export interface CentralizedExchange {
  address: string
  paging_token: string
  domain: string
  name: string
  tags: string[]
}

interface CentralizedExchangeDirectory {
  _embedded: {
    records: CentralizedExchange[]
  }
}

const newFileName = 'centralized-exchanges-restructured.json'
const newFilePath = path.resolve('app', 'data', newFileName)
const targetUrl =
  'https://api.stellar.expert/explorer/directory?tag[]=exchange&limit=200'

async function main() {
  const response = await fetch(targetUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch centralized exchanges: ${response.status} ${response.statusText}`,
    )
  }

  const originalData = (await response.json()) as CentralizedExchangeDirectory

  // exclude records with "unsafe" tag
  const unsafeExcludedData = originalData._embedded.records.filter((record) => {
    return !record.tags.includes('unsafe')
  })

  // extract unique records by domain
  const uniqueDomainData = unsafeExcludedData.reduce(
    (acc: CentralizedExchange[], current: CentralizedExchange) => {
      const isDuplicate = acc.some((record) => record.domain === current.domain)
      if (!isDuplicate) {
        acc.push(current)
      }
      return acc
    },
    [],
  )

  fs.writeFileSync(newFilePath, JSON.stringify(uniqueDomainData, null, 2))
  console.log(`File ${newFilePath} written successfully`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
