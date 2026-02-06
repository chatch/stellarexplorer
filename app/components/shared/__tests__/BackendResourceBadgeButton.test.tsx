import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BackendResourceBadgeButtonWithResourceModal from '../BackendResourceBadgeButton'
import { act } from 'react-test-renderer'

describe('BackendResourceBadgeButtonWithResourceModal', () => {
  it('renders button with given label', () => {
    const label = 'Test Label'
    const url = 'https://somebackend.xyz/resource/12345'
    const filterFn = jest.fn()

    render(
      <BackendResourceBadgeButtonWithResourceModal
        label={label}
        url={url}
        filterFn={filterFn}
      />,
    )

    const button = screen.getByText(label)
    expect(button).toBeInTheDocument()
  })

  it('opens the modal when button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    const user = userEvent.setup()

    const label = 'Test Label'
    const url = 'https://somebackend.xyz/resource/12345'
    const filterFn = jest.fn()

    render(
      <BackendResourceBadgeButtonWithResourceModal
        label={label}
        url={url}
        filterFn={filterFn}
      />,
    )

    const button = screen.getByText(label)
    await act(async () => {
      await user.click(button)
    })

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: `${url} open new window` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'open new window' }),
    ).toBeInTheDocument()
  })

  it('closes the modal when close button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    const user = userEvent.setup()

    const label = 'Test Label'
    const url = 'https://somebackend.xyz/resource/12345'
    const filterFn = jest.fn()

    render(
      <BackendResourceBadgeButtonWithResourceModal
        label={label}
        url={url}
        filterFn={filterFn}
      />,
    )

    const button = screen.getByText(label)
    await act(async () => {
      await user.click(button)
    })

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'Close' })
    await act(async () => {
      await user.click(closeButton)
    })

    expect(
      screen.queryByRole('button', { name: 'Copy' }),
    ).not.toBeInTheDocument()
  })

  it('displays a descriptive error message when fetch fails due to CORS', async () => {
    fetchMock.mockReject(new Error('Network error'))

    const user = userEvent.setup()

    const label = 'Test Label'
    const url = 'https://somebackend.xyz/resource/12345'

    render(
      <BackendResourceBadgeButtonWithResourceModal label={label} url={url} />,
    )

    const button = screen.getByText(label)
    await act(async () => {
      await user.click(button)
    })

    expect(
      await screen.findByText(
        /Failed to fetch resource. This is typically due to a CORS policy blocking the request from your browser for this specific host./,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/Action Required:/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /Click here to open .* directly in a new tab\./,
      }),
    ).toBeInTheDocument()
  })
})
