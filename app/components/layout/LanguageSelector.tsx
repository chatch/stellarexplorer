import Dropdown from 'react-bootstrap/Dropdown'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { FormattedMessage, useIntl } from 'react-intl'
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

export default function LanguageSelector({
  switcher,
}: {
  switcher: React.MouseEventHandler<HTMLElement>
}) {
  const { formatMessage } = useIntl()
  return (
    <Dropdown id="language-selector" className="nav-dropdown">
      <Dropdown.Toggle style={styleLanguageSelector}>
        <img
          src={langSelectImg}
          style={{ height: 35, width: 28 }}
          alt={formatMessage({ id: 'language.selector' })}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ color: 'white' }}>
        <DropdownItem lang="en" onClick={switcher}>
          English
        </DropdownItem>
        <DropdownItem lang="zh-Hans" onClick={switcher}>
          中文 (简体)
        </DropdownItem>
        <DropdownItem lang="zh-Hant" onClick={switcher}>
          中文 (繁體)
        </DropdownItem>
        <DropdownItem lang="ru" onClick={switcher}>
          Pусский
        </DropdownItem>
        <DropdownItem lang="vi" onClick={switcher}>
          Tiếng Việt
        </DropdownItem>
        <DropdownItem lang="fr" onClick={switcher}>
          Français
        </DropdownItem>
        <DropdownItem lang="ur" onClick={switcher}>
          اردو
        </DropdownItem>
        <DropdownItem lang="hi" onClick={switcher}>
          हिन्दी
        </DropdownItem>
        <DropdownItem lang="ja" onClick={switcher}>
          日本語
        </DropdownItem>
        <DropdownItem lang="id" onClick={switcher}>
          Bahasa Indonesia
        </DropdownItem>
        <DropdownItem
          onClick={onClickTranslateHelp}
          style={{ borderTop: '1px solid black' }}
        >
          <FormattedMessage id="translate.help" />
        </DropdownItem>
      </Dropdown.Menu>
    </Dropdown>
  )
}
