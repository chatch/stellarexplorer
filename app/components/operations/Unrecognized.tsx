import { FormattedMessage } from 'react-intl'

const Unrecognized = (props: any) => {
  const { type }: { type: string } = props
  console.log(JSON.stringify(props, null, 2))
  return (
    <FormattedMessage
      id="operation.unrecognized"
      values={{
        type: type,
      }}
    />
  )
}

export default Unrecognized
