# Private Vercel Media Relay

This folder is a complete, generic private relay that works with `../tiktok-carousel-draft-demo.gs`.

## Copy these files into a private GitHub repository

```text
private-tiktok-media-relay/
  package.json
  vercel.json
  api/
    _relay.js
    upload.js
    cleanup.js
    media/
      [token].js
```

Do not make the relay repository public. It does not contain a secret by itself, but it is the private storage portion of your workflow.

## Required Vercel setup

1. Import the private repository into Vercel.
2. Create and connect a Vercel Blob store.
3. In Vercel Project Settings, add `RELAY_SHARED_SECRET` as an environment variable.
4. Deploy.
5. Copy the Vercel production URL into `RELAY_BASE_URL` in Apps Script.
6. Add the same `RELAY_SHARED_SECRET` value to Apps Script Project Settings as `TIKTOK_RELAY_SECRET`.

## Security behavior

- Uploads require the relay secret.
- Temporary objects are private in Vercel Blob.
- TikTok receives signed, short-lived media URLs.
- Apps Script asks the relay to delete temporary media after the transfer window.

Never put `RELAY_SHARED_SECRET` in this repository, screenshots, prompts, or a public book companion file.
