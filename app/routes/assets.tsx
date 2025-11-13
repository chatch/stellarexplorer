import { useEffect } from 'react'

import { Assets } from './lib/assets-base'
import { setTitle } from '../lib/utils'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
  const response = await fetch(
    'https://api.stellar.expert/explorer/public/asset?sort=volume7d&order=desc&limit=50',
  )
  // TODO: handle failures gracefully here.
  // this page started failing when the fetch started returning bad gateway:
  // https://github.com/chatch/stellarexplorer/actions/runs/15315533612/job/43088549719
  // core problem was is it tries to parse JSON when we'd got back a HTML error page.
  // look for error statuses in the response before attempting a parse to json
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
