import {readFileSync} from 'fs'

/**
 * fetch() mock that maps the url to a data file on disk,
 *
 * Eg.: fetch('https://any.domain/and/path/data1.json')
 *
 * will resolve with the contents of ./__data__/data1.json
 */

const dataFile = filename => `./src/__mocks__/__data__/${filename}`
const filenameRegEx = /.*\/(.*.json)/

const fetchMock = url => {
  const match = filenameRegEx.exec(url)
  const jsonStr = readFileSync(dataFile(match[1]))
  return Promise.resolve({json: () => JSON.parse(jsonStr)})
}

export default () => {
  return {
    fetch: fetchMock,
    Headers: undefined,
    Request: undefined,
    Response: undefined,
  }
}
