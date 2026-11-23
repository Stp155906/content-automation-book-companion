# 04 Private Vercel Relay

TikTok's servers often cannot fetch a Google Drive preview link because they are not signed into your Google account. The relay solves that without making your original Drive folder public.

The relay:

1. Receives each image from Apps Script.
2. Stores a temporary private copy in Vercel Blob.
3. Creates a signed link that expires in about 30 minutes.
4. Lets TikTok fetch the image with that temporary link.
5. Deletes the temporary relay copies after the upload window.

## Create the relay project

1. In GitHub, create a **new private repository** for your relay. Do not use this public book companion repository.
2. Copy all files inside [`../templates/private-vercel-relay`](../templates/private-vercel-relay) into that private repository.
3. Import the private repository into Vercel as a new project.
4. In Vercel Storage, create or connect a Vercel Blob store.

## Add the environment variable

In Vercel, open the project, then **Settings**, then **Environment Variables**.

Add this value for Production, Preview, and Development if you use all three:

```text
Name:  RELAY_SHARED_SECRET
Value: create a long random private password
```

Use a password manager to generate the value. Never put it in GitHub.

## Deploy and copy the relay address

Deploy the Vercel project. Copy its production address, such as:

```text
https://your-private-relay.vercel.app
```

This becomes `RELAY_BASE_URL` in the Apps Script. The exact same `RELAY_SHARED_SECRET` becomes the `TIKTOK_RELAY_SECRET` Script Property in Apps Script.

## Why the address can be public while the media stays private

The project address is visible, but its upload and cleanup endpoints require the secret. Media links are signed and expire. It should not have a public dashboard or a permanent open image gallery.
