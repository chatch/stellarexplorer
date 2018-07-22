import React from 'react'
import {FormattedMessage} from 'react-intl'

/**
 * 'Export data to CSV' button that when clicked will generate a CSV file
 * with the records and offer it in the browser for download.
 */
const ExportButton = ({onClick, label}) => (
  <button
    className="backend-resource-badge-button"
    onClick={onClick}
  >
    <FormattedMessage id="csv-export" />
  </button>
)

export default ExportButton
