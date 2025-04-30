const path = require('path');
require('dotenv').config({ path: '.env' });
const WebBundlePlugin = require('webbundle-webpack-plugin');
const {
  NodeCryptoSigningStrategy,
  parsePemKey,
  WebBundleId,
} = require('wbn-sign');

const key = parsePemKey(process.env.ED25519KEY);

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  plugins: [
    new WebBundlePlugin({
      baseURL: new WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
      static: { dir: path.resolve(__dirname, 'src') },
      output: 'borderless.swbn',
      integrityBlockSign: {
        strategy: new NodeCryptoSigningStrategy(key),
      },
      headerOverride: {
        'cross-origin-embedder-policy': 'require-corp',
        'cross-origin-opener-policy': 'same-origin',
        'cross-origin-resource-policy': 'same-origin',
        'content-security-policy':
          "base-uri 'none'; default-src 'self'; object-src 'none'; frame-src 'self' https: blob: data:; connect-src 'self' https: wss:; script-src 'self' 'wasm-unsafe-eval'; img-src 'self' https: blob: data:; media-src 'self' https: blob: data:; font-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; require-trusted-types-for 'script';",
      },
    }),
  ],
};
