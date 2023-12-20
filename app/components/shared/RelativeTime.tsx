import { FormattedRelativeTime } from 'react-intl'
import { useEffect, useState } from 'react'
import * as React from 'react'

let hydrating = true

// from remix-utils (inline due to incompat. with remix 2)
export function useHydrated() {
  let [hydrated, setHydrated] = useState(() => !hydrating)
  useEffect(function hydrate() {
    hydrating = false
    setHydrated(true)
  }, [])
  return hydrated
}

// from remix-utils (inline due to incompat. with remix 2)
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: any
  fallback?: any | null
}) {
  return useHydrated()
    ? React.createElement(React.Fragment, null, children())
    : React.createElement(React.Fragment, null, fallback)
}

export default function RelativeTime({
  timeStr,
}: Readonly<{ timeStr: string }>) {
  const date = new Date(timeStr)
  const secondsSinceTime: number = (date.valueOf() - Date.now()) / 1000
  return (
    <ClientOnly>
      {() => (
        <FormattedRelativeTime
          value={secondsSinceTime}
          numeric="auto"
          unit="second"
          updateIntervalInSeconds={10}
        />
      )}
    </ClientOnly>
  )
}
