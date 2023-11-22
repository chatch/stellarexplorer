import { useEffect } from 'react'

import { Assets } from './lib/assets-base'
import { setTitle } from '../lib/utils'

import directory from '../data/directory'

const { assets } = directory

export default function AssetsAll() {
  useEffect(() => {
    setTitle('Assets')
  }, [])

  return <Assets assetKeys={Object.keys(assets)} />
}
