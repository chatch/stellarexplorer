import { useEffect } from 'react'

import { Assets } from './lib/assets-base'
import { setTitle } from '../lib/utils'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
  const response = await fetch(
    'https://api.stellar.expert/explorer/public/asset?sort=volume7d&order=desc&limit=50',
  )
  const assets = await response.json()
  return json(assets._embedded.records)
}

export default function AssetsAll() {
  const assets = useLoaderData<typeof loader>()

  useEffect(() => {
    setTitle('Assets')
  }, [])

  return <Assets assets={assets} />
}
