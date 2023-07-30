import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons"

// TODO: want new-window but doesn't appear to exist (was previously from bootstrap Glyphicon )
const NewWindowIcon = () => (
  <FontAwesomeIcon
    icon={faWindowRestore}
    style={{ fontSize: 11, marginLeft: 5 }}
  />
)

export default NewWindowIcon
