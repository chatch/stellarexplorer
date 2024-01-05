import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

export interface CentralizedExchange {
  address: string
  paging_token: string
  domain: string
  name: string
  tags: string[]
}

const fileName = 'centralized-exchanges.json'
const filePath = path.resolve(__dirname, fileName)
const newFileName = 'centralized-exchanges-restructured.json'
const newFilePath = path.resolve('app', 'data', newFileName)
const targetUrl =
  'https://api.stellar.expert/explorer/directory?tag[]=exchange&limit=200'
const curlCommand = `curl "${targetUrl}" | jq > ${filePath}`

exec(curlCommand, (err) => {
  if (err) {
    console.error(`Error executing curl command: ${err.message}`)
    return
  }
  console.log(`Curl command (${curlCommand}) executed successfully`)

  const originalData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  // exclude records with "unsafe" tag
  const unsafeExcludedData = { records: [] }
  unsafeExcludedData.records = originalData._embedded.records.filter(
    (record: CentralizedExchange) => {
      return !record.tags.includes('unsafe')
    },
  )

  // extract unique records by domain
  const uniqueDomainData = unsafeExcludedData.records.reduce(
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

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`)
      return
    }

    console.log(`File ${filePath} deleted successfully`)
  })
})
