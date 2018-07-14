import PropTypes from 'prop-types'

const REGEX_TRAILING_ZEROS = /0*$/
const REGEX_TRAILING_DOT = /\.$/

// chop off any trailing 0s and the '.' if only . left.
const FormattedAmount = ({amount}) => {
  let fmtAmount = amount
  fmtAmount = fmtAmount.replace(REGEX_TRAILING_ZEROS, '')
  if (fmtAmount.endsWith('.'))
    fmtAmount = fmtAmount.replace(REGEX_TRAILING_DOT, '')
  return fmtAmount
}

FormattedAmount.propTypes = {
  amount: PropTypes.string.isRequired,
}

export default FormattedAmount
