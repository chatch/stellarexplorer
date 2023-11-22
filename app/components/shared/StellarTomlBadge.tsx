import BackendResourceBadgeButton from './BackendResourceBadgeButton'

const Badge = ({ domain }: { domain: string }) => {
  const tomlUrl = `https://${domain}/.well-known/stellar.toml`
  return (
    <span className="stellarToml">
      <BackendResourceBadgeButton label="server.toml" url={tomlUrl} />
    </span>
  )
}

export default Badge
