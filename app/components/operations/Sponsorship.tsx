import AccountLink from '../shared/AccountLink'

const BeginSponsoringFutureReserves = ({
  sponsoredId,
}: {
  sponsoredId: string
}) => {
  return (
    <span>
      Begin sponsorship for <AccountLink account={sponsoredId} />
    </span>
  )
}

const EndSponsoringFutureReserves = ({
  beginSponsor,
}: {
  beginSponsor: string
}) => {
  return (
    <span>
      End sponsorship for <AccountLink account={beginSponsor} />
    </span>
  )
}

export { BeginSponsoringFutureReserves, EndSponsoringFutureReserves }
