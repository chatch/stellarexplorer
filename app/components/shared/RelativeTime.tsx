import { FormattedRelativeTime } from 'react-intl'
import { ClientOnly } from 'remix-utils'

/* This is what existed in ole steexp but the component no longer exists in this form.
   
    Changing to use FormattedRelativeTime (the replacement),
    leave old comment and code below until we see what that looks like
 */
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