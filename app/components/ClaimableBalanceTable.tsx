import type { ClaimableBalanceProps } from './operations/ClaimableBalances'
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl'

interface ClaimableBalanceTableProps {
  records: ReadonlyArray<ClaimableBalanceProps>
  horizonURL?: string
  isClaimant: boolean
}

interface ClaimableBalanceRowProps extends ClaimableBalanceProps {
  idx: number
}

const shortenString = (str: string): string => {
  return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`
}

const getAsset = (asset: string) => {
  const [assetName, assetId] = asset.split(':')
  return { assetName, assetId }
}

export const ClaimableBalanceRow = ({
  id,
  idx,
  amount,
  sponsor,
  asset,
  lastModifiedTime,
}: ClaimableBalanceRowProps) => {
  const { assetName } = getAsset(asset)
  return (
    <tr>
      <td>{idx + 1}</td>
      <td className="d-flex">
        <span>{parseFloat(amount)}</span>
        <p className="text-orange px-2">{assetName}</p>
      </td>
      <td>
        <a href={`/account/${sponsor}`}>{shortenString(sponsor)}</a>
      </td>
      <td>
        <a href={`/claimable-balance/${id}`}>{shortenString(id)}</a>
      </td>
      <td>
        <FormattedDate value={lastModifiedTime} />
        &nbsp;
        <FormattedTime value={lastModifiedTime} />
      </td>
    </tr>
  )
}

export default function ClaimableBalanceTable({
  records,
  isClaimant,
}: ClaimableBalanceTableProps) {
  return (
    <table className="table table-striped table-bordered table-sm">
      <thead>
        <tr>
          <th>#</th>
          <th>
            <FormattedMessage id="amount" />
          </th>
          <th>
            {isClaimant ? (
              <FormattedMessage id="sponsor" />
            ) : (
              <FormattedMessage id="claimant" />
            )}
          </th>
          <th>
            <FormattedMessage id="balance" />
          </th>
          <th>
            <FormattedMessage id="updated" />
          </th>
        </tr>
      </thead>
      {records.length ? (
        <tbody>
          {records.map((record, idx) => (
            <ClaimableBalanceRow key={record.id} idx={idx} {...record} />
          ))}
        </tbody>
      ) : (
        'No claimable balances found.'
      )}
    </table>
  )
}
