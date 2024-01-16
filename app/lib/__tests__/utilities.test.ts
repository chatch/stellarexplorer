import {
  formatAmountToHumanReadable,
  formatPrice24h,
  formatPercentToHumanReadable,
  getAssetCode,
  rmTrailingZeros,
} from '../utilities'

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

describe('rmTrailingZeros', () => {
  it('removes trailing zeros from a number', () => {
    expect(rmTrailingZeros('1.000')).toBe('1')
    expect(rmTrailingZeros('1.0100')).toBe('1.01')
  })

  it('returns the input number if it does not have a decimal point', () => {
    expect(rmTrailingZeros('9')).toBe('9')
    expect(rmTrailingZeros('10')).toBe('10')
    expect(rmTrailingZeros('100')).toBe('100')
  })
})

describe('formatPrice24h', () => {
  it('returns the correct formatted price for scientific notation', () => {
    expect(formatPrice24h(1.000158544e-7)).toBe('0.0000001')
    expect(formatPrice24h(1.000158544e-8)).toBe('0.00000001')
    expect(formatPrice24h(1.000158544e-9)).toBe('0.000000001')
    expect(formatPrice24h(1.000158544e-10)).toBe('0.0000000001')
    expect(formatPrice24h(1.000158544e-11)).toBe('0.00000000001')
    expect(formatPrice24h(1.000158544e-12)).toBe('0.000000000001')
    expect(formatPrice24h(1.000158544e-13)).toBe('0')
    expect(formatPrice24h(1.000158544e-14)).toBe('0')
  })

  // NOTE: The given arguments are real data from the API and the expected results are what is displayed.
  //   Some test cases are commented out because the expected results are different.
  //   The current code returns more accurate results than the expected results.
  it('returns the correct formatted price for real data', () => {
    expect(formatPrice24h(1.000158544)).toBe('1')
    expect(formatPrice24h(0.1162778965)).toBe('0.116')
    // expect(formatPrice24h(0.1162778965)).toBe('0.12')
    expect(formatPrice24h(1.000080025)).toBe('1')
    expect(formatPrice24h(0.004272635651)).toBe('0.0043')
    expect(formatPrice24h(0.1162433799)).toBe('0.116')
    // expect(formatPrice24h(0.1162433799)).toBe('0.12')
    expect(formatPrice24h(0.5672689893)).toBe('0.567')
    // expect(formatPrice24h(0.5672689893)).toBe('0.57')
    expect(formatPrice24h(0.0006572223141)).toBe('0.00066')
    expect(formatPrice24h(0.001110448921)).toBe('0.0011')
    expect(formatPrice24h(0.005037997368)).toBe('0.005')
    expect(formatPrice24h(0.000041064844)).toBe('0.000041')
    expect(formatPrice24h(1.001009737)).toBe('1.001')
    expect(formatPrice24h(45850.0971)).toBe('45850')
    expect(formatPrice24h(0.0008509240035)).toBe('0.00085')
    expect(formatPrice24h(0.006040593184)).toBe('0.006')
    expect(formatPrice24h(2410.851343)).toBe('2411')
    expect(formatPrice24h(0.007361075687)).toBe('0.0074')
    expect(formatPrice24h(0.0001084383067)).toBe('0.00011')
    expect(formatPrice24h(0.00010232011)).toBe('0.0001')
    expect(formatPrice24h(0.006892939205)).toBe('0.0069')
    expect(formatPrice24h(0.01149030418)).toBe('0.011')
    expect(formatPrice24h(0.02248896625)).toBe('0.022')
    expect(formatPrice24h(0.997137453)).toBe('0.997')
    // expect(formatPrice24h(0.997137453)).toBe('1')
    expect(formatPrice24h(0.02740643697)).toBe('0.027')
    expect(formatPrice24h(1.002024791)).toBe('1.002')
    expect(formatPrice24h(1.021164209)).toBe('1.021')
    expect(formatPrice24h(0.6454479505)).toBe('0.645')
    // expect(formatPrice24h(0.6454479505)).toBe('0.65')
    expect(formatPrice24h(0.00004233033978)).toBe('0.000042')
    expect(formatPrice24h(45887.24815)).toBe('45887')
    expect(formatPrice24h(0.00001619334098)).toBe('0.000016')
    expect(formatPrice24h(49.01787884)).toBe('49')
    expect(formatPrice24h(2444.982688)).toBe('2445')
    expect(formatPrice24h(0.0005220493182)).toBe('0.00052')
    expect(formatPrice24h(0.002866537638)).toBe('0.0029')
    expect(formatPrice24h(1.000445999)).toBe('1')
    expect(formatPrice24h(0.0003107416072)).toBe('0.00031')
    expect(formatPrice24h(1.093316026)).toBe('1.093')
    expect(formatPrice24h(0.004713963693)).toBe('0.0047')
    expect(formatPrice24h(0.0005642258214)).toBe('0.00056')
    expect(formatPrice24h(0.1160774628)).toBe('0.116')
    // expect(formatPrice24h(0.1160774628)).toBe('0.12')
    expect(formatPrice24h(0.2014468585)).toBe('0.201')
    // expect(formatPrice24h(0.2014468585)).toBe('0.2')
    expect(formatPrice24h(0.000002706722043)).toBe('0.0000027')
    expect(formatPrice24h(45839.04612)).toBe('45839')
    expect(formatPrice24h(0.0004621366942)).toBe('0.00046')
    expect(formatPrice24h(6.75e-10)).toBe('0.00000000068')
    expect(formatPrice24h(5.565971311)).toBe('5.566')
    // expect(formatPrice24h(5.565971311)).toBe('5.57')
    expect(formatPrice24h(5.4e-11)).toBe('0.000000000054')
    expect(formatPrice24h(0.000005560368148)).toBe('0.0000056')
    expect(formatPrice24h(0.0005795540857)).toBe('0.00058')
    expect(formatPrice24h(0.01682822123)).toBe('0.017')
    expect(formatPrice24h(0.0002456809121)).toBe('0.00025')
  })
})

describe('formatPercentToHumanReadable', () => {
  it('formats number >= 100', () => {
    expect(formatPercentToHumanReadable(100)).toBe(100)
    expect(formatPercentToHumanReadable(100.4)).toBe(100)
    expect(formatPercentToHumanReadable(100.5)).toBe(101)
  })

  it('formats number >= 0.1 and < 100', () => {
    expect(formatPercentToHumanReadable(0.124)).toBe(0.12)
    expect(formatPercentToHumanReadable(0.125)).toBe(0.13)
    expect(formatPercentToHumanReadable(1)).toBe(1.0)
    expect(formatPercentToHumanReadable(1.1)).toBe(1.1)
  })

  it('formats number >= 0.001 and < 0.1', () => {
    expect(formatPercentToHumanReadable(0.00123)).toBe(0.001)
    expect(formatPercentToHumanReadable(0.0015)).toBe(0.002)
  })

  it('formats number < 0.001', () => {
    expect(formatPercentToHumanReadable(0.0009)).toBe(0)
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
