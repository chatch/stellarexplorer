import JSONButton from './JSONButton'
import ClipboardCopy from './ClipboardCopy'

const TitleWithJSONButton = ({
  title,
  titleSecondary,
  url,
}: {
  title: string
  titleSecondary?: string
  url?: string
}) => (
  <div>
    <span>
      {title}
      {titleSecondary && (
        <span>
          {} <span className="secondary-heading">{titleSecondary}</span>
          <ClipboardCopy text={titleSecondary} />
        </span>
      )}
    </span>
    {url && (
      <span className="pull-right">
        <JSONButton url={url} />
      </span>
    )}
  </div>
)

const titleWithJSONButton = (title: string, url: string) => {
  return <TitleWithJSONButton title={title} url={url} />
}

export { titleWithJSONButton, TitleWithJSONButton }
