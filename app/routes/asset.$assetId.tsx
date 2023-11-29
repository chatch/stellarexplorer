import { useEffect } from 'react'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { setTitle } from '../lib/utils'
import { Assets } from './lib/assets-base'

import directory from '../data/directory'

const { assets } = directory

export const loader = ({ params }: { params: { assetId: string } }) => {
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
  } = useLoaderData<typeof loader>()

  return <Assets assetKeys={matchingAssetKeys} />
}
