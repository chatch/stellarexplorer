import type { KnownAccountType } from '~/data/known_accounts'

// 2 supported logo forms
const squareDimensions = { height: 75, width: 75 }
const rectangleDimensions = { height: 40, width: 150 }

// exchange image from anchor image
const imagesInBoth = ['papayabot', 'papayaswap', 'ripplefox']

export default function Logo({
  name,
  type,
}: Readonly<{
  name?: string
  type: KnownAccountType
}>) {
  const nameLower = name?.toLowerCase() ?? ''
  const imgSrc = `/img/${nameLower}.png`
  const dimen =
    type !== 'exchange' || imagesInBoth.indexOf(nameLower) !== -1
      ? squareDimensions
      : rectangleDimensions
  return (
    <span>
      <img
        src={imgSrc}
        alt={name}
        title={name}
        height={dimen.height}
        width={dimen.width}
      />
    </span>
  )
}
