import {
  isDefInt,
  isPublicKey,
  isStellarAddress,
  isTxHash,
  shortHash,
} from '../utils'

it('isDefInt checks for defined int correctly', () => {
  expect(isDefInt()).toBe(false)
  expect(isDefInt('')).toBe(false)
  expect(isDefInt(null)).toBe(false)

  expect(isDefInt({})).toBe(false)
  expect(isDefInt({}, 'x')).toBe(false)
  expect(isDefInt({y: 1}, 'x')).toBe(false)

  expect(isDefInt({x: undefined}, 'x')).toBe(false)
  expect(isDefInt({x: 'string'}, 'x')).toBe(false)

  expect(isDefInt({x: 1}, 'x')).toBe(true)
  expect(isDefInt({x: 12345678901234567890}, 'x')).toBe(true)
})

it('isPublicKey identifies a valid key', () => {
  expect(isPublicKey()).toBe(false)
  expect(isPublicKey('')).toBe(false)
  expect(isPublicKey(null)).toBe(false)

  // same length as valid key and looks valid but is not
  expect(
    isPublicKey('GBQHXMAVPD3AKY5PWFCBVT3NFIXGE345FVZLL4JXKTVSFT5FKMEV5QIX')
  ).toBe(false)

  // valid secret key is not a valid public key
  expect(
    isPublicKey('SA5OGCE2AQMSXCKYHGQZ3RUV2464W5M2QXBBAY2GSBRTFUUTKQI5UB2A')
  ).toBe(false)

  // valid
  expect(
    isPublicKey('GBQHXMAVPD3AKY5PWFCBVT3NFIXGE345FVZLL4JXKTVSFT5FKMEV5QIL')
  ).toBe(true)
})

it('isStellarAddress identifies a valid stellar address', () => {
  expect(isStellarAddress()).toBe(false)
  expect(isStellarAddress('')).toBe(false)
  expect(isStellarAddress(null)).toBe(false)

  expect(isStellarAddress('comma,forbidden*stellar.org')).toBe(false)
  expect(isStellarAddress('two*asterisk*stellar.org')).toBe(false)

  expect(isStellarAddress('jed*stellar.org')).toBe(true)
  expect(isStellarAddress('hatch1234*some-domain-888.a.b.c')).toBe(true)
})

it('isTxHash identifies a valid transaction hash', () => {
  expect(isTxHash()).toBe(false)
  expect(isTxHash('')).toBe(false)
  expect(isTxHash(null)).toBe(false)
  expect(isTxHash('ddefd')).toBe(false)

  expect(
    isTxHash('ddeff3d3b8455f8173ef4d63e6650625734207fd351d2b9eeeaf0e38ffe1064b')
  ).toBe(true)
})

it('shortHash shortens hash', () => {
  expect(
    shortHash(
      'ddeff3d3b8455f8173ef4d63e6650625734207fd351d2b9eeeaf0e38ffe1064b'
    )
  ).toBe('ddeff3d...')
})
