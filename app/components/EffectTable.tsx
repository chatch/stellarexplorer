import Table from "react-bootstrap/Table"
import { FormattedMessage } from "react-intl"

import Effect from "./Effect"
import type { EffectProps } from "~/routes/effects._index"


interface EffectTableProps {
  parentRenderTimestamp?: number,
  records: ReadonlyArray<EffectProps>,
  showAccount?: boolean,
  account?: any
}

export default function EffectTable({
  parentRenderTimestamp,
  records,
  showAccount = true,
  account,
}: EffectTableProps) {
  return (
    <div>
      <Table
        id="effect-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            {showAccount && (
              <th>
                <FormattedMessage id="account" />
              </th>
            )}
            <th>
              <FormattedMessage id="type" />
            </th>
            <th>
              <FormattedMessage id="details" />
            </th>
            <th>
              <FormattedMessage id="transaction" />
            </th>
            <th>
              <FormattedMessage id="time" />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {records.map((effect) => {
            return (
              <Effect
                key={effect.id}
                effect={effect}
                parentRenderTimestamp={parentRenderTimestamp}
                showAccount={showAccount}
              />
            )
          })}
        </tbody>
      </Table>
      {/* <div className="text-center" id="csv-export">
        <ExportToCSVComponent server={server} account={account} />
      </div>
    </div> */}
    </div>
  )
}
