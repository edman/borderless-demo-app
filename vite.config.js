/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

import wbn from "rollup-plugin-webbundle";
import * as wbnSign from "wbn-sign";
import dotenv from "dotenv";

dotenv.config();

const plugins = [injectHTML()];

if (process.env.NODE_ENV === "production") {
  const key = wbnSign.parsePemKey(process.env.SIGNING_KEY);

  plugins.push({
    ...wbn({
      baseURL: new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
      static: { dir: "public" },
      output: "borderless-demo.swbn",
      integrityBlockSign: {
        strategy: new wbnSign.NodeCryptoSigningStrategy(key),
      },
    }),
    enforce: "post",
  });
}

export default defineConfig({
  plugins,
  server: {
    port: 5193,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5193,
    },
    watch: {
      ignored: ["**/.git", "**/.direnv", "**/node_modules"],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});
