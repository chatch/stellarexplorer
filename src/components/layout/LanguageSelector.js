import React from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import {injectIntl} from 'react-intl'
import langSelectImg from '../../img/lang-select.png'

const styleLanguageSelector = {
  backgroundColor: 'rgba(255, 0, 0, 0)',
  border: 0,
  padding: 0,
}

const LanguageSelector = ({
  selectedLanguage,
  switcher,
  intl: {formatMessage},
}) =>
  <Dropdown id="Language-Selector">
    <Dropdown.Toggle style={styleLanguageSelector}>
      <img
        src={langSelectImg}
        style={{height: 35, width: 28}}
        alt={formatMessage({id: 'language.selector'})}
      />
    </Dropdown.Toggle>
    <Dropdown.Menu style={{color: 'white'}}>
      <MenuItem eventKey="1" lang="en" onClick={switcher}>English</MenuItem>
      <MenuItem eventKey="2" lang="zh" onClick={switcher}>中文</MenuItem>
    </Dropdown.Menu>
  </Dropdown>

export default injectIntl(LanguageSelector)
