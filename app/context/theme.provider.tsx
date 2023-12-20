import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

enum Theme {
  Dark = 'dark',
  Light = 'light',
}

type ThemeContextType = [
  Theme | undefined,
  Dispatch<SetStateAction<Theme | undefined>>,
]

const ThemeContext = createContext<ThemeContextType>([undefined, () => {}])

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme | undefined>(undefined)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    }
  }, [])

  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme(): ThemeContextType {
  return useContext(ThemeContext)
}

export { Theme, ThemeProvider, useTheme }
