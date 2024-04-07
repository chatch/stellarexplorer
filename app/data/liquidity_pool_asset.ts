import type { AssetProps } from '~/routes/lib/assets-base'
import { getAssetCode, getAssetImage } from '~/routes/lib/assets-base'
import assetsJson from './assets.json'

type LiquidityPoolAssetData = {
  icon: string
  url: string
}

type LiquidityPoolAsset = {
  [key: string]: LiquidityPoolAssetData
}

const convertData = (assets: any) => {
  const convertedData: LiquidityPoolAsset = {}

  assets.forEach((asset: AssetProps) => {
    const code = getAssetCode(asset)

    convertedData[code] = {
      icon: getAssetImage(asset),
      url: asset.domain || '',
    }
  })

  return convertedData
}

export const liquidityPoolAsset: LiquidityPoolAsset = convertData(assetsJson)
