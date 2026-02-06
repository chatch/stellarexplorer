import { useEffect } from 'react'
import { json } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'

import { setTitle } from '../lib/utils'
import { Assets } from './lib/assets-base'

import directory from '../data/directory'

const { assets } = directory

export const clientLoader = ({ params }: { params: { assetId: string } }) => {
  const matchingAssetKeys = Object.keys(assets).filter((k) =>
    k.startsWith(params.assetId),
  )
  return json({ matchingAssetKeys })
}

export default function AssetsById() {
  useEffect(() => {
    setTitle('Assets')
  }, [])

  const {
    matchingAssetKeys,
  }: {
    matchingAssetKeys: Array<string>
  } = useLoaderData<typeof clientLoader>()

  const matchingAssets = matchingAssetKeys.map((key) => assets[key]) as any

  return <Assets assets={matchingAssets} />
}
