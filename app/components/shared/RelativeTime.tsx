import { FormattedRelativeTime } from 'react-intl'
import { ClientOnly } from 'remix-utils'

export default function RelativeTime({ timeStr }: { timeStr: string }) {
  const date = new Date(timeStr)
  const secondsSinceTime: number = (date.valueOf() - Date.now()) / 1000
  return (
    <ClientOnly>
      {() =>
        <FormattedRelativeTime
          value={secondsSinceTime}
          numeric='auto'
          unit='second'
          updateIntervalInSeconds={10}
        />
      }
    </ClientOnly>
  )
} 