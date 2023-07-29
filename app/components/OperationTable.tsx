import React from "react"
import Table from "react-bootstrap/Table"
import { FormattedMessage } from "react-intl"

import { default as Operation, operationTypesKeys } from "./operations/Operation"
import { filterFor } from "./shared/OperationType"

const filterFn = (event: React.ChangeEvent<HTMLSelectElement>) => {
  filterFor(event.target.value)
}

export interface OperationTableProps {
  compact: boolean
  // possiblyMoreDataAvailable: boolean
  records: ReadonlyArray<any>
  // server: HorizonServer,
};

const getOperationTypeFilter = () => {
  const opTypeFilter = window.location.search.match(/opTypeFilter=([a-z_]*)/)
  if (opTypeFilter?.[1]) {
    return opTypeFilter[1]
  }
}

export default function OperationTable({
  compact,
  records,
  // possiblyMoreDataAvailable,
}: OperationTableProps) {
  return (
    <div>
      {compact === false && (
        <div className="filter">
          <FormattedMessage id="filter.for-operation-type" />:
          <select onChange={filterFn} defaultValue={getOperationTypeFilter()}>
            <option />
            {operationTypesKeys.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <br />
          {/* {getOperationTypeFilter() && possiblyMoreDataAvailable && (
            <span className="disclaimer">
              <FormattedMessage id="filter.more-data-possibly-available" />
            </span>
          )} */}
        </div>
      )}
      <Table
        id="operation-table"
        className="table-striped table-hover table-condensed"
      >
        <thead>
          <tr>
            <th>
              <FormattedMessage id="account" />
            </th>
            <th>
              <FormattedMessage id="operation" />
            </th>
            {compact === false && (
              <th>
                <FormattedMessage id="transaction" />
              </th>
            )}
            {compact === false && (
              <th>
                <FormattedMessage id="type" />
              </th>
            )}
            <th>
              <FormattedMessage id="time" />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {records.map((op) => (
            <Operation
              key={op.id}
              compact={compact}
              op={op}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
