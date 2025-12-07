import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
    server: {
        port: 3000,
        allowedHosts: ["publicnet.local", "testnet.local", "futurenet.local"],
    },
    plugins: [
        remix({
            ssr: false,
        }),
        tsconfigPaths(),
        nodePolyfills(),
    ],
});
