import AccountLink from '../shared/AccountLink'
import Asset from '../shared/Asset'

export interface SetTrustLineFlagsProps {
  assetCode: string
  assetIssuer: string
  assetType: string
  trustor: string
  clearFlagsS: string[]
  setFlagsS: string[]
}

const SetTrustLineFlags = ({
  assetCode,
  assetIssuer,
  assetType,
  trustor,
  clearFlagsS,
  setFlagsS,
}: SetTrustLineFlagsProps) => (
  <span>
    Set flags for asset:{' '}
    <Asset code={assetCode} issuer={assetIssuer} type={assetType} />
    ;&nbsp; Trustor: <AccountLink account={trustor} />
    ;&nbsp;
    {clearFlagsS && clearFlagsS.length > 0 && `Clear: [${clearFlagsS}];`}&nbsp;
    {setFlagsS && setFlagsS.length > 0 && `Set: [${setFlagsS}]`}
  </span>
)

export default SetTrustLineFlags
