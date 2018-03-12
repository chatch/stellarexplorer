import React from 'react'
import PropTypes from 'prop-types'
import BackendResourceBadgeButton from './BackendResourceBadgeButton'

const Badge = ({domain}) => {
  const tomlUrl = `https://${domain}/.well-known/stellar.toml`
  return (
    <span className="stellarToml">
      <BackendResourceBadgeButton label="server.toml" url={tomlUrl} />
    </span>
  )
}

Badge.propTypes = {
  domain: PropTypes.string.isRequired,
}

export default Badge
