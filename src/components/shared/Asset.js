import React from 'react'
import AccountLink from './AccountLink'

const Asset = (props) => {
  const isLumens = props.type === "native"
  const propCode = isLumens
    ? "XLM"
    : props.code
  return (
    <div>
      <span>{propCode} {!isLumens && <small>[<AccountLink label="issuer" account={props.issuer}/>]</small>
}
      </span>
    </div>
  )
}

export default Asset
