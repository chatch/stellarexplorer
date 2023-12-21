import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'

import { TitleWithJSONButton } from '../TitleWithJSONButton'

describe('TitleWithJSONButton', () => {
  it('renders button with given url', () => {
    const url = 'https://somebackend.xyz/ledger/12345'
    const title = 'Ledger'
    render(<TitleWithJSONButton title={title} url={url} />)
    expect(screen.getByText('Ledger')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()

    // snapshot test
    const tree = renderer
      .create(<TitleWithJSONButton title={title} url={url} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
