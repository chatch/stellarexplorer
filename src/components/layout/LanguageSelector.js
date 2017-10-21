import React from 'react'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import {FormattedMessage, injectIntl} from 'react-intl'
import langSelectImg from '../../img/lang-select.png'

const onClickTranslateHelp = () => {
  window.location.href =
    'https://github.com/chatch/stellarexplorer/tree/master/src/languages'
}

const styleLanguageSelector = {
  backgroundColor: 'rgba(255, 0, 0, 0)',
  border: 0,
  padding: 0,
}

const LanguageSelector = ({
  selectedLanguage,
  switcher,
  intl: {formatMessage},
}) => (
  <Dropdown id="Language-Selector">
    <Dropdown.Toggle style={styleLanguageSelector}>
      <img
        src={langSelectImg}
        style={{height: 35, width: 28}}
        alt={formatMessage({id: 'language.selector'})}
      />
    </Dropdown.Toggle>
    <Dropdown.Menu style={{color: 'white'}}>
      <MenuItem lang="en" onClick={switcher}>
        English
      </MenuItem>
      <MenuItem lang="zh" onClick={switcher}>
        中文
      </MenuItem>
      <MenuItem lang="ru" onClick={switcher}>
        Pусский
      </MenuItem>
      <MenuItem lang="vi" onClick={switcher}>
        Tiếng Việt
      </MenuItem>
      <MenuItem
        onClick={onClickTranslateHelp}
        style={{borderTop: '1px solid black'}}
      >
        <FormattedMessage id="translate.help" />
      </MenuItem>
    </Dropdown.Menu>
  </Dropdown>
)

export default injectIntl(LanguageSelector)
