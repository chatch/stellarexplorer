import { Theme } from '~/context/theme.provider'
import lightIcon from 'public/img/sun.svg'
import darkIcon from 'public/img/moon.svg'

const ThemeSwitcher = ({
  theme = Theme.Dark,
}: {
  theme: Theme | undefined
}) => {
  return (
    <div className="theme-selector">
      {theme === Theme.Light ? <LightIcon /> : <DarkIcon />}
    </div>
  )
}

const DarkIcon = () => {
  return <img src={darkIcon} alt="moon" width={32} height={32} />
}

const LightIcon = () => {
  return <img src={lightIcon} alt="sun" width={32} height={32} />
}

export default ThemeSwitcher
