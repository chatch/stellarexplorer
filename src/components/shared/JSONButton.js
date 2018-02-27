import React from 'react'
import BackendResourceBadgeButton from './BackendResourceBadgeButton'

/**
 * 'JSON' button that when clicked will show the contents of the backend JSON
 * resource at 'url'.
 */
const JSONButton = ({url}) => (
  <BackendResourceBadgeButton label="JSON" url={url} />
)

export default JSONButton
