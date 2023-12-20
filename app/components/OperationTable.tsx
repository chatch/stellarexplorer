import React from 'react'
import Table from 'react-bootstrap/Table'
import { FormattedMessage } from 'react-intl'

import { default as Operation } from './operations/Operation'

export interface OperationTableProps {
  compact: boolean
  records: ReadonlyArray<any>
  horizonURL?: string
}

export default function OperationTable({
  compact,
  records,
  horizonURL, // possiblyMoreDataAvailable,
}: Readonly<OperationTableProps>) {
  return (
    <div>
      {/* TODO: restore the filter  */}
      {/* {compact === false && (
        <div className="filter">
          <FormattedMessage id="filter.for-operation-type" />:
          <select
            onChange={filterFn}
          // defaultValue={getOperationTypeFilter()}
          >
            <option />
            {operationTypesKeys.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <br /> */}
      {/* {getOperationTypeFilter() && possiblyMoreDataAvailable && (
            <span className="disclaimer">
              <FormattedMessage id="filter.more-data-possibly-available" />
            </span>
          )} */}
      {/* </div>
      )} */}
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
              horizonURL={horizonURL}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
