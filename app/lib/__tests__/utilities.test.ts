import { formatAmountToHumanReadable, getAssetCode } from '../utilities'

describe('formatAmountToHumanReadable', () => {
  it('formats amount to human readable with B suffix', () => {
    expect(formatAmountToHumanReadable('1500000000')).toBe('1.50B')
    expect(formatAmountToHumanReadable('2000000000')).toBe('2.00B')
  })

  it('formats amount to human readable with M suffix', () => {
    expect(formatAmountToHumanReadable('1500000')).toBe('1.50M')
    expect(formatAmountToHumanReadable('2000000')).toBe('2.00M')
  })

  it('formats amount to human readable with K suffix', () => {
    expect(formatAmountToHumanReadable('1500')).toBe('1.50K')
    expect(formatAmountToHumanReadable('2000')).toBe('2.00K')
  })

  it('formats amount to human readable without suffix', () => {
    expect(formatAmountToHumanReadable('500')).toBe('500.00')
    expect(formatAmountToHumanReadable('100')).toBe('100.00')
  })
})

describe('getAssetCode', () => {
  it('returns XLM for native asset', () => {
    expect(getAssetCode('native')).toBe('XLM')
  })

  it('returns the ticker symbol for non-native asset', () => {
    expect(getAssetCode('BTC:foo')).toBe('BTC')
    expect(getAssetCode('ETH:bar')).toBe('ETH')
  })
})
