import AccountLink from './AccountLink'

// For XLM code and issuer aren't set. type will be 'native'
interface AssetProps {
  code: string
  issuer: string
  type: string
}

export default ({ code, issuer, type }: AssetProps) => {
  const isLumens = type === 'native' || code === 'native'
  const propCode = isLumens ? 'XLM' : code
  return (
    <span>
      {propCode}{' '}
      {!isLumens && (
        <span style={{ fontSize: 'x-small' }}>
          [<AccountLink account={issuer} />]
        </span>
      )}
    </span>
  )
}
