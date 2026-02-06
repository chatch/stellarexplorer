import { Link } from '@remix-run/react'

const linkStyle = { color: 'white', textDecoration: 'underline' }

interface TitleWithLinkProps {
  title: string
  rightLinkLabel: string
  rightLinkAddr: string
}

export default function TitleWithLink({
  title,
  rightLinkLabel,
  rightLinkAddr,
}: TitleWithLinkProps) {
  return (
    <div>
      <span>{title}</span>
      <Link to={rightLinkAddr} className="pull-right" style={linkStyle}>
        <span>{rightLinkLabel}</span>
      </Link>
    </div>
  )
}
