import { Dropdown } from 'react-bootstrap'
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
        <Dropdown.Item lang="en" onClick={switcher}>
          English
        </Dropdown.Item>
        <Dropdown.Item lang="zh-Hans" onClick={switcher}>
          中文 (简体)
        </Dropdown.Item>
        <Dropdown.Item lang="zh-Hant" onClick={switcher}>
          中文 (繁體)
        </Dropdown.Item>
        <Dropdown.Item lang="ru" onClick={switcher}>
          Pусский
        </Dropdown.Item>
        <Dropdown.Item lang="vi" onClick={switcher}>
          Tiếng Việt
        </Dropdown.Item>
        <Dropdown.Item lang="fr" onClick={switcher}>
          Français
        </Dropdown.Item>
        <Dropdown.Item lang="ur" onClick={switcher}>
          اردو
        </Dropdown.Item>
        <Dropdown.Item lang="hi" onClick={switcher}>
          हिन्दी
        </Dropdown.Item>
        <Dropdown.Item lang="ja" onClick={switcher}>
          日本語
        </Dropdown.Item>
        <Dropdown.Item lang="id" onClick={switcher}>
          Bahasa Indonesia
        </Dropdown.Item>
        <Dropdown.Item
          onClick={onClickTranslateHelp}
          style={{ borderTop: '1px solid black' }}
        >
          <FormattedMessage id="translate.help" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}