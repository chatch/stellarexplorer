import React from 'react'

const eachSetOption = props => {
  let options = []
  if (props.lowThreshold || props.medThreshold || props.highThreshold)
    options.push(
      <span>
        Thresholds: L: {props.lowThreshold} M: {props.medThreshold} H:
        {props.highThreshold}
      </span>
    )

  if (props.homeDomain)
    options.push(<span>Home Domain: {props.homeDomain}</span>)

  if (props.setFlagsS) options.push(<span>Set Flags: {props.setFlagsS}</span>)

  if (props.clearFlagsS)
    options.push(<span>Clear Flags: {props.clearFlagsS}</span>)

  if (props.signerKey) options.push(<span>Signer Key: {props.signerKey}</span>)

  if (props.signerWeight)
    options.push(<span>Signer Weight: {props.signerWeight}</span>)

  if (props.masterKeyWeight)
    options.push(<span>Signer Weight: {props.masterKeyWeight}</span>)

  return options
}

const SetOptions = props =>
  <span>
    Set Options: [{eachSetOption(props).map((Opt, idx, all) => {
      const isLast = idx === all.length - 1
      return <span key={idx}>{Opt}{!isLast && <span>, </span>}</span>
    })}]
  </span>

export default SetOptions
