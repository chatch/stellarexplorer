import { useEffect } from 'react'
import { json } from '~/lib/remix-shim'
import { useLoaderData } from '@remix-run/react'

import { setTitle } from '../lib/utils'
import { Assets, type AssetProps } from './lib/assets-base'

// Live asset search via stellar.expert. The directory lookup previously fed
// local {code,issuer,domain} records into the Assets component, which expects
// the richer live-API shape (supply/trustlines/payments/price7d/...), causing
// a crash on e.g. /asset/USD. Fetch matching assets from the same backend the
// /assets page uses so the page renders a proper list of matching assets.
const STELLAR_EXPERT_ASSET_SEARCH =
  'https://api.stellar.expert/explorer/public/asset?search='

export const clientLoader = async ({
  params,
}: {
  params: { assetId: string }
}) => {
  const response = await fetch(
    `${STELLAR_EXPERT_ASSET_SEARCH}${encodeURIComponent(
      params.assetId,
    )}&limit=50`,
  )
  // guard against non-JSON error pages so we never crash on parse
  if (!response.ok) return json([] as AssetProps[])
  const data = await response.json()
  const records = (data?._embedded?.records ?? []) as AssetProps[]
  return json(records)
}

export default function AssetsById() {
  useEffect(() => {
    setTitle('Assets')
  }, [])

  const assets = useLoaderData<typeof clientLoader>() as AssetProps[]

  return <Assets assets={assets} />
}
