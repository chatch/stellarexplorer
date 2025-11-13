// @ts-ignore
import { jestPreviewConfigure } from 'jest-preview'
import { enableFetchMocks } from 'jest-fetch-mock'

import '@testing-library/jest-dom'
import './app/styles/styles.css'

// Polyfills for Node.js test environment
// @ts-ignore
global.TextEncoder = require('util').TextEncoder
// @ts-ignore
global.TextDecoder = require('util').TextDecoder

enableFetchMocks()

jestPreviewConfigure({
  // Enable autoPreview so Jest Preview runs automatically
  // whenever your test fails, without you having to do anything!
  autoPreview: true,
})
