import { getContractDecompiled } from '~/lib/stellar/contracts'
import contractCodeTab, {
  contractCodeLoaderFn,
} from './lib/contract-code-tab-base'

export const loader = contractCodeLoaderFn(getContractDecompiled)

const CodeReadableTab = contractCodeTab(loader)

export default function () {
  return (
    <CodeReadableTab>
      <div>
        The code below was produced by the{' '}
        <a href="https://github.com/WebAssembly/wabt">
          The WebAssembly Binary Toolkit
        </a>{' '}
        wasm-decompile tool. It's a C like format intended for readability.
      </div>
    </CodeReadableTab>
  )
}
