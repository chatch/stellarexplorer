import { jestPreviewConfigure } from 'jest-preview'
import { enableFetchMocks } from 'jest-fetch-mock'

import '@testing-library/jest-dom'
import './app/styles/styles.css'

enableFetchMocks()

jestPreviewConfigure({
  // Enable autoPreview so Jest Preview runs automatically
  // whenever your test fails, without you having to do anything!
  autoPreview: true,
})
