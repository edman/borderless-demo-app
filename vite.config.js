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

import { resolve } from "path";
import dotenv from "dotenv";
import fs from "fs";
import wbn from "rollup-plugin-webbundle";
import injectHTML from "vite-plugin-html-inject";
import * as wbnSign from "wbn-sign";

dotenv.config();

const plugins = [
  injectHTML(),
  setWebManifestVersion(),
  generateUpdateManifest(),
];

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
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
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
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true, // Stops a warning about overwriting outDir since it's outsite `root`.
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        window: resolve(__dirname, "src/modal/window.html"),
      },
    },
  },
});

// Sets the VERSION env variable in the web manifest file.
//
// This is a vite plugin. See https://vite.dev/guide/api-plugin.
function setWebManifestVersion() {
  const setVersion = (version) => {
    const WEBMANIFEST = "public/.well-known/manifest.webmanifest";
    const manifest = JSON.parse(fs.readFileSync(WEBMANIFEST, "utf-8"));
    if (manifest.version === version) return;
    manifest.version = version;
    fs.writeFileSync(WEBMANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  };
  return {
    name: "borderless:set-manifest-version",
    apply: "build",
    buildStart: () => {
      const version = process.env.VERSION;
      if (version) setVersion(version.replace("v", ""));
    },
    closeBundle: () => setVersion("0.0.0"),
  };
}

// Reads versions from git in the TAGS env variable and creates an update-manifest.json.
function generateUpdateManifest() {
  let out_dir;
  return {
    name: "borderless:generate-update-manifest-json",
    apply: "build",
    configResolved: (config) => (out_dir = config.build.outDir),
    closeBundle: () => {
      const tags = process.env.TAGS;
      if (!tags) return;

      const update_manifest = {
        versions: JSON.parse(tags).map(({ ref }) => {
          const version = ref.replace("refs/tags/v", "");
          return {
            version,
            src: `https://github.com/edman/borderless-demo-app/releases/download/v${version}/borderless-demo.swbn`,
          };
        }),
      };
      fs.writeFileSync(
        `${out_dir}/update-manifest.json`,
        JSON.stringify(update_manifest, null, 2),
      );
    },
  };
}
