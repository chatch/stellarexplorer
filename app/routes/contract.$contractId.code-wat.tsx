import { getContractWat } from '~/lib/stellar/contracts'
import contractCodeTab, {
  contractCodeLoaderFn,
} from './lib/contract-code-tab-base'

export const loader = contractCodeLoaderFn(getContractWat)

const CodeWatTab = contractCodeTab(loader)

export default function () {
  return (
    <CodeWatTab>
      <div>
        The code below is in{' '}
        <a href="https://webassembly.github.io/spec/core/text/index.html">
          wat format (WebAssembly text format)
        </a>{' '}
        and was produced by the{' '}
        <a href="https://github.com/WebAssembly/wabt">
          The WebAssembly Binary Toolkit
        </a>{' '}
        wasm2wat tool.
      </div>
    </CodeWatTab>
  )
}
