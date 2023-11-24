import { jestPreviewConfigure } from 'jest-preview'
import './app/styles/styles.css'

jestPreviewConfigure({
  // Enable autoPreview so Jest Preview runs automatically
  // whenever your test fails, without you having to do anything!
  autoPreview: true,
})
