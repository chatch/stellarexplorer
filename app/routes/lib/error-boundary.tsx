import { useRouteError, isRouteErrorResponse } from '@remix-run/react'
import { Container } from 'react-bootstrap'

export const ErrorBoundary = () => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <Container>
        <h3>Error</h3>
        <p>{error.statusText}</p>
      </Container>
    )
  } else if (error instanceof Error) {
    return (
      <Container>
        <h3>Error</h3>
        <p>{error.message}</p>
      </Container>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
