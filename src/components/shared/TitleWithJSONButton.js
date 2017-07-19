import PropTypes from 'prop-types'
import React from 'react'
import JSONButton from './JSONButton'

const TitleWithJSONButton = ({id, title, urlFn}) =>
  <div>
    <span>{title}</span>
    <span className="pull-right"><JSONButton id={id} urlFn={urlFn} /></span>
  </div>

TitleWithJSONButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  urlFn: PropTypes.func.isRequired,
}

const titleWithJSONButton = (id, title, urlFn) => {
  return <TitleWithJSONButton title={title} id={id} urlFn={urlFn} />
}

export {titleWithJSONButton, TitleWithJSONButton}
