import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'

import JSONButton from '../JSONButton'

describe('JSONButton', () => {
  it('renders button with given url', () => {
    const url = 'https://somebackend.xyz/resource/12345'

    render(<JSONButton url={url} />)

    const button = screen.getByText('JSON')
    expect(button).toBeInTheDocument()

    // snapshot test
    const tree = renderer.create(<JSONButton url={url} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
