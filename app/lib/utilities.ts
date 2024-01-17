const formatAmountToHumanReadable = (amountStr: string): string => {
  const amount = parseFloat(amountStr)
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(2) + 'B'
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K'
  }

  return amount.toFixed(2)
}

const rmTrailingZeros = (num: string): string => {
  return num.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')
}

const formatPrice24h = (price: number): string => {
  if (price >= 100) return rmTrailingZeros(price.toFixed(0))
  if (price >= 10) return rmTrailingZeros(price.toFixed(1))
  if (price >= 0.01) return rmTrailingZeros(price.toFixed(3))
  if (price >= 0.001) return rmTrailingZeros(price.toFixed(4))
  if (price >= 0.0001) return rmTrailingZeros(price.toFixed(5))
  if (price >= 0.00001) return rmTrailingZeros(price.toFixed(6))
  if (price >= 0.000001) return rmTrailingZeros(price.toFixed(7))
  if (price >= 0.0000001) return rmTrailingZeros(price.toFixed(8))
  if (price >= 0.00000001) return rmTrailingZeros(price.toFixed(9))
  if (price >= 0.000000001) return rmTrailingZeros(price.toFixed(10))
  if (price >= 0.0000000001) return rmTrailingZeros(price.toFixed(11))

  return rmTrailingZeros(price.toFixed(12))
}

const formatPercentToHumanReadable = (percent: number): number => {
  if (percent >= 100) return parseFloat(percent.toFixed(0))
  if (percent >= 0.1) return parseFloat(percent.toFixed(2))
  if (percent >= 0.001) return parseFloat(percent.toFixed(3))
  return parseFloat(percent.toFixed(2))
}

const getAssetCode = (asset: string): string => {
  return asset === 'native' ? 'XLM' : asset.split(':')[0]
}

const isPathClaimableBalance = (path: string): boolean =>
  path.startsWith('/claimable-balance')

export {
  formatAmountToHumanReadable,
  formatPercentToHumanReadable,
  formatPrice24h,
  getAssetCode,
  rmTrailingZeros,
  isPathClaimableBalance,
}
