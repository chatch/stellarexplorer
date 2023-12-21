import { render, screen } from '@testing-library/react'
import enTranslation from '../../../lib/languages/en.json'
import zhHansTranslation from '../../../lib/languages/zh-Hans.json'

import { IntlProvider } from 'react-intl'

import ManageData from '../ManageData'

describe('ManageData', () => {
  it('decodes ordinary string values', () => {
    render(
      <IntlProvider locale="en" messages={enTranslation}>
        <ManageData name="lang" value="aW5kb25lc2lhbg==" />
      </IntlProvider>,
    )

    expect(
      screen.getByText((content) => {
        return content.includes('indonesian')
      }),
    ).toBeInTheDocument()
  })

  it('decodes utf8 string values', () => {
    render(
      <IntlProvider locale="zh-CN" messages={zhHansTranslation}>
        <ManageData name="utf8value" value="6ams6ams6JmO6JmO" />
      </IntlProvider>,
    )

    expect(
      screen.getByText((content) => {
        return content.includes('马马虎虎')
      }),
    ).toBeInTheDocument()
  })

  it('truncates a long key and long value', () => {
    const aLongPrefix = 'some_really_long_12345678901234567890123456789'
    const aLongName = `name_${aLongPrefix}`
    const aLongValue = Buffer.from(`value_${aLongPrefix}`).toString('base64')
    render(
      <IntlProvider locale="en" messages={enTranslation}>
        <ManageData name={aLongName} value={aLongValue} />
      </IntlProvider>,
    )

    expect(
      screen.getByText((content) => {
        return content.includes('value_some_really_long_1234...')
      }),
    ).toBeInTheDocument()
  })
})
