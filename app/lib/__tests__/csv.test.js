import {jsonToCSV} from '../csv.js'

import effectsRecords from './__data__/effects'
import pathPaymentsRecords from './__data__/pathPayments'

describe('jsonToCSV', () => {
  test('effects', () => {
    expect(jsonToCSV(effectsRecords)).toMatchSnapshot()
  })
  test('pathPayments', () => {
    expect(jsonToCSV(pathPaymentsRecords)).toMatchSnapshot()
  })
})
