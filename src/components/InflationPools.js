import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Panel from 'react-bootstrap/lib/Panel'
import Row from 'react-bootstrap/lib/Row'
import Table from 'react-bootstrap/lib/Table'
import {FormattedMessage, injectIntl} from 'react-intl'
import PropTypes from 'prop-types'

import {setTitle} from '../lib/utils'
import AccountLink from './shared/AccountLink'
import NewWindowIcon from './shared/NewWindowIcon'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

import pools from '../data/inflation_pools.json'

const METADATA_PATH =
  'https://raw.githubusercontent.com/chatch/stellarexplorer/master/src/data/inflation_pools.json'

const Pool = ({account, name, website}) => {
  return (
    <tr className="directoryRow">
      <td>{name}</td>
      <td>
        <a href={website} target="_blank">
          {website}
          <NewWindowIcon />
        </a>
      </td>
      <td>
        <AccountLink account={account} hideKnown />
      </td>
    </tr>
  )
}

Pool.propTypes = {
  account: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
}

class Pools extends React.Component {
  render() {
    setTitle('Inflation Pools')
    const {formatMessage} = this.props.intl
    const header = titleWithJSONButton(
      formatMessage({id: 'inflation.pools'}),
      METADATA_PATH
    )
    return (
      <Grid>
        <Row>
          <Panel header={header}>
            <Table>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="name" />
                  </th>
                  <th>
                    <FormattedMessage id="home" />
                  </th>
                  <th>
                    <FormattedMessage id="account" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(pools).map(key => {
                  const pool = pools[key]
                  return <Pool key={key} account={key} {...pool} />
                })}
              </tbody>
            </Table>
          </Panel>
        </Row>
      </Grid>
    )
  }
}

export default injectIntl(Pools)
