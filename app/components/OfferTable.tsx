import React from 'react'
import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'

import { OfferRow as Offer } from './operations/Offer'

interface OfferTableProps {
  compact?: boolean
  records: ReadonlyArray<any>
  showSeller?: boolean
  horizonURL?: string
}

export default function OfferTable({
  compact,
  records,
  showSeller = true,
  horizonURL,
}: OfferTableProps) {
  if (records.length === 0)
    return <div style={{ marginTop: 20, marginBottom: 20 }}>No Offers</div>

  return (
    <div>
      <Table
        id="offer-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            {showSeller && (
              <th>
                <FormattedMessage id="seller" />
              </th>
            )}
            <th>
              <FormattedMessage id="sell" />
            </th>
            <th>
              <FormattedMessage id="buy" />
            </th>
            <th>
              <FormattedMessage id="amount" />
            </th>
            <th>
              <FormattedMessage id="price" />
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((offer) => (
            <Offer
              key={offer.id}
              id={offer.id}
              offerId={offer.id}
              amount={offer.amount}
              price={offer.price}
              seller={offer.seller}
              buyingAssetCode={offer.buying.asset_code}
              buyingAssetIssuer={offer.buying.asset_issuer}
              buyingAssetType={offer.buying.asset_type}
              sellingAssetCode={offer.selling.asset_code}
              sellingAssetIssuer={offer.selling.asset_issuer}
              sellingAssetType={offer.selling.asset_type}
              showSeller={showSeller}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
