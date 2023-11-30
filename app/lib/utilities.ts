const formatAmountToHumanReadable = (amountStr: string) => {
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

const getAssetCode = (asset: string) => {
  return asset === 'native' ? 'XLM' : asset.split(':')[0]
}

export { formatAmountToHumanReadable, getAssetCode }
