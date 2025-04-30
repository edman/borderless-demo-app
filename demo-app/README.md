# Borderless IWA Demo

Install dependencies:
`pnpm install`

Run the app locally:
`pnpm run serve`

If you want to create a signed bundle, set the ed25519 private key to be used
for signing in the `.env` file. You can copy the sample `.env` we used to
recreate the `borderless.swbn` file in this repo:
`cp .env.example .env`

Alternatively, you can create your own key and overwrite the `.env` file like so:

```bash
cat << EOF > .env
ED25519KEY="$(openssl genpkey -algorithm Ed25519)"
EOF
```

Package and sign the IWA using the key in `.env`:
`pnpm run build`

Flags to enable when running on chrome:

chrome://flags#enable-desktop-pwas-borderless (Linux/ChromeOS only)
chrome://flags#enable-desktop-pwas-additional-windowing-controls
chrome://flags#enable-isolated-web-app-dev-mode

Once you have a signed web bundle open chrome://web-app-internals and click
"Select file..." in "Install IWA from Signed Web Bundle".
