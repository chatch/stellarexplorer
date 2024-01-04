import { Theme, useTheme } from '~/context/theme.provider'
import lightIcon from 'public/img/sun.svg'
import darkIcon from 'public/img/moon.svg'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useTheme()
  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <div onClick={toggleTheme} className="theme-selector">
      {theme === Theme.Light ? <LightIcon /> : <DarkIcon />}
    </div>
  )
}

const DarkIcon = () => {
  return <img src={darkIcon} alt="moon" width={28} height={28} />
}

const LightIcon = () => {
  return <img src={lightIcon} alt="sun" width={28} height={28} />
}

export default ThemeSwitcher
