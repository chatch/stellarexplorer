import React from 'react'
import {FormattedMessage} from 'react-intl'
import has from 'lodash/has'

import ExportButton from './ExportButton'

class CSVExport extends React.Component {

  static defaultProps = {
    limit: 100,
    page: 0,
    refresh: false,
    usePaging: false,
  }

  state = {
    cursor: 0,
    wasExportStarted: false,
    isExportingFinished: false,
    fetchedRecords: [],
  }

  render() {
    if (this.props.wasExportStarted) {
      return (
          <div>
            {this.props.isExportingFinished === true ? (
              this.props.exportLimitExceeded === true ? (
                <FormattedMessage
                  id="csv-export.limit-exceeded"
                  values={{count: has(this.props, 'fetchedRecords') && this.props.fetchedRecords.length}} />
              ) : (
                <FormattedMessage
                  id={this.props.fetchedRecords.length > 0 ? 'csv-export.complete': 'csv-export.no-records'}
                  values={{count: has(this.props, 'fetchedRecords') && this.props.fetchedRecords.length}} />
              )
            ) : (
              <div>
                <FormattedMessage id="csv-export.fetching" /> | <FormattedMessage id="csv-export.fetched" values={{count: this.props.fetchedRecords.length}} />
              </div>
            )}
          </div>
      )
    }

    return (
      <ExportButton onClick={this.props.onClick} {...this.props} />
    )
  }
}

export default CSVExport
