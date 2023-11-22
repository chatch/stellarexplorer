import BackendResourceBadgeButton from './BackendResourceBadgeButton'

/**
 * 'JSON' button that when clicked will show the contents of the backend JSON
 * resource at 'url'.
 */
const JSONButton = ({
  url,
  filterFn,
}: {
  url: string
  filterFn?: (data: any) => string
}) => <BackendResourceBadgeButton label="JSON" url={url} filterFn={filterFn} />

export default JSONButton
