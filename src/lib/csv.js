import {saveAs} from './filesaver'

// build and return csv string from array of column values
const toCsvString = stringArr =>
  stringArr.reduce(
    (accumulated, val, idx) =>
      (accumulated += `"${
        typeof val === 'object' ? JSON.stringify(val).replace(/"/g, '""') : val
      }"${idx < stringArr.length - 1 ? ',' : ''}`),
    ''
  )

const jsonToCSV = records => {
  const columns = []
  // get list of all columns across all records (as some record lists contain mixed structures)
  records.forEach(rec => {
    const newKeys = Object.keys(rec).filter(
      key => columns.indexOf(key) === -1 && typeof rec[key] !== 'function'
    )
    if (newKeys.length > 0) {
      columns.push(...newKeys)
    }
  })
  // map col name to col idx
  const colToIdx = columns.reduce((accumulated, curCol, curIdx) => {
    accumulated[curCol] = curIdx
    return accumulated
  }, {})

  const numCols = columns.length
  const headerCsv = toCsvString(columns)

	
