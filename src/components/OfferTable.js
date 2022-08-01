import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage} from 'react-intl'
import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'
import {OfferRow as Offer} from './operations/Offer'
import {withDataFetchingContainer} from './shared/DataFetchingContainer'
import {withDataFetchingAllContainer} from './shared/DataFetchingAllContainer'
import {withPaging} from './shared/Paging'
import {withSpinner} from './shared/Spinner'
import CSVExport from './shared/CSVExport'
class OfferTable extends React.Component {
  static defaultProps = {
    showSeller: true,
  }
  componentDidMount() {
    if (this.props.page === 0 && this.props.records.length < this.props.limit) {
      this.props.hidePagingFn()
    }
  }
  render() {
    const {records, showSeller} = this.props
    if (records.length === 0)
      return <div style={{marginTop: 20, marginBottom: 20}}>No Offers</div>

    return (
      <div>
           <Table
          id="offer-table"
          className="table-striped table-hover table-condensed"
        >
	@@ -45,9 +39,9 @@ class OfferTable extends React.Component {
                </th>
              )}
              <th>
                                <FormattedMessage id="sell" />
              </th>
            <th>
                <FormattedMessage id="buy" />
              </th>
              <th>
	@@ -84,25 +78,21 @@ class OfferTable extends React.Component {
    )
  }
}
OfferTable.propTypes = {
  compact: PropTypes.bool,
  records: PropTypes.array.isRequired,
  server: PropTypes.object.isRequired,
  showSeller: PropTypes.bool,
}
const rspRecToPropsRec = record => {
  return mapKeys(record, (v, k) => camelCase(k))
}
const fetchRecords = ({account, limit, server}) => {
  const builder = server.offers('accounts', account)
  builder.limit(limit)
  builder.order('desc')
  return builder.call()
}
const ExportToCSVComponent = withDataFetchingAllContainer(fetchRecords)(
  CSVExport
)
	@@ -112,5 +102,4 @@ const enhance = compose(
  withDataFetchingContainer(fetchRecords, rspRecToPropsRec),
  withSpinner()
)
export default enhance(OfferTable)
