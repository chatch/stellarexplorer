import PropTypes from 'prop-types'
import React from 'react'
import JSONButton from './JSONButton'

const TitleWithJSONButton = ({title, url}) => (
  <div>
    <span>{title}</span>
    <span className="pull-right">
      <JSONButton url={url} />
    </span>
  </div>
)

TitleWithJSONButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  url: PropTypes.string.isRequired,
}

const titleWithJSONButton = (title, url) => {
  return <TitleWithJSONButton title={title} url={url} />
}

export {titleWithJSONButton, TitleWithJSONButton}
