import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const assetsDir = path.join(process.cwd(), 'build', 'client', 'assets')
const files = await readdir(assetsDir)
const manifestFile = files.find((file) => /^manifest-[a-f0-9]+\.js$/.test(file))

if (!manifestFile) {
  throw new Error(`No Remix browser manifest found in ${assetsDir}`)
}

const manifestPath = path.join(assetsDir, manifestFile)
const source = await readFile(manifestPath, 'utf8')
const patched = source.replaceAll('"./assets/', '"/assets/')

await writeFile(manifestPath, patched)
console.log(`Patched decentralized Remix manifest: ${manifestPath}`)
