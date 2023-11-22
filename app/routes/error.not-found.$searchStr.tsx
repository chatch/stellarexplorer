import Container from 'react-bootstrap/Container'
import { useParams } from '@remix-run/react'
import { FormattedMessage } from 'react-intl'

export default function SearchNotFound() {
  const { searchStr } = useParams()
  return (
    <Container>
      <FormattedMessage id="error.cant.find" values={{ searchStr }} />
    </Container>
  )
}
