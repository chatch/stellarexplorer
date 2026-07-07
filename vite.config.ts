import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const buildTarget =
  process.env.STEEXP_BUILD_TARGET === 'decentralized'
    ? 'decentralized'
    : 'centralized'

export default defineConfig({
  base: buildTarget === 'decentralized' ? './' : '/',
  define: {
    __STEEXP_BUILD_TARGET__: JSON.stringify(buildTarget),
  },
  server: {
    port: 3000,
    allowedHosts: ['publicnet.local', 'testnet.local', 'futurenet.local'],
  },
  plugins: [
    remix({
      ssr: false,
    }),
    tsconfigPaths(),
    nodePolyfills(),
  ],
})
