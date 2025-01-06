import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import type { AssetProps } from '~/routes/lib/assets-base'

const baseUrl = 'https://api.stellar.expert'
const totalPages = 10
const fileName = 'assets.json'
const filePath = path.resolve('app', 'data', fileName)
const targetUrl =
  '/explorer/public/asset?sort=volume7d&order=desc&limit=50&cursor=0'

async function fetchData(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const curlCommand = `curl "${url}" | jq`
    exec(curlCommand, (err, stdout) => {
      if (err) {
        reject(err)
        return
      }
      const data = JSON.parse(stdout)
      resolve(data)
    })
  })
}

async function fetchAllPages() {
  const data = []
  let pageUrl = `${baseUrl}${targetUrl}`

  for (let i = 1; i <= totalPages; i++) {
    console.log(`Fetching page ${i}... ${pageUrl}`)
    const pageData = await fetchData(pageUrl)
    data.push(
      ...pageData._embedded.records.map((record: AssetProps) => {
        const obj: any = { asset: record.asset }

        if (record.domain) {
          obj.domain = record.domain
        }

        if (record.tomlInfo) {
          obj.tomlInfo = {
            code: record.tomlInfo.code,
            image: record.tomlInfo.image,
          }
        }

        return obj
      }),
    )

    const nextPageUrl = pageData._links?.next?.href
    if (!nextPageUrl) break
    pageUrl = `${baseUrl}${nextPageUrl}`
  }

  return data
}

async function main() {
  try {
    const data = await fetchAllPages()
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(filePath, jsonData)
    console.log(`Data fetched and saved to ${fileName}`)
  } catch (error: any) {
    console.error(`Error fetching data: ${error.message}`)
  }
}

main()
