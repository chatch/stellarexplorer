const BumpFootprintExpiration = ({
  ledgersToExpire,
}: {
  ledgersToExpire: number
}) => {
  return <span>Bump footprint expiration to {ledgersToExpire} ledgers</span>
}
const RestoreFootprint = () => {
  return <span>Restore footprint</span>
}
export { BumpFootprintExpiration, RestoreFootprint }
