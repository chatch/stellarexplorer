import { Theme, useTheme } from '~/context/theme.provider'
import { publicAssetUrl } from '~/lib/build-target'

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
  return (
    <img
      src={publicAssetUrl('img/moon.svg')}
      alt="moon"
      width={28}
      height={28}
    />
  )
}

const LightIcon = () => {
  return (
    <img src={publicAssetUrl('img/sun.svg')} alt="sun" width={28} height={28} />
  )
}

export default ThemeSwitcher
