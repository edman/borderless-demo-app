# Borderless IWA Demo

Install dependencies:

`pnpm install`

Run the app locally:

`pnpm run dev`

If you want to create a signed bundle, set the ed25519 private key to be used
for signing in the `.env` file. You can copy the sample `.env` we used to
recreate the `borderless-demo.swbn` file released in this repo:

`cp .env.example .env`

Alternatively, you can create your own key and overwrite the `.env` file like
so:

```bash
cat << EOF > .env
SIGNING_KEY="$(openssl genpkey -algorithm Ed25519)"
EOF
```

Package and sign the IWA using the key in `.env`. The outptut will be in
`dist/borderless-demo.swbn`:

`pnpm run build`

Flags to enable when running on chrome:

*   chrome://flags#enable-desktop-pwas-borderless
*   chrome://flags#enable-isolated-web-app-dev-mode

To install a signed web bundle:

*   Open chrome://web-app-internals.
*   Find "Install IWA from Signed Web Bundle".
*   Click "Select file..." and choose the signed web fundle file.
