# 03 TikTok Developer App

TikTok changes dashboard wording sometimes, but the important settings stay the same.

## Create the app

1. Sign in at TikTok for Developers.
2. Create a new app or open the one you made for this workflow.
3. Give it a clear private-tool name, such as `My Draft Uploader`.
4. Choose an appropriate category, such as Productivity.
5. Add an honest description. Example: `A private creator tool that prepares original media for authorized social accounts.`

## Turn on only what this workflow needs

Enable:

- **Login Kit**
- **Content Posting API**

Request or enable these scopes:

```text
user.info.basic
video.upload
```

Keep **Direct Post** off. This workflow uses **Upload to TikTok**, so the creator receives the content in TikTok and chooses when to publish.

## Add the redirect URI

In the Login Kit settings, add this exact pattern:

```text
https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback
```

Replace `YOUR_SCRIPT_ID` with the Script ID from Apps Script Project Settings. Do not add an extra slash. The value in TikTok must exactly match the value in `TIKTOK_REDIRECT_URI` in the script.

## Website verification

TikTok may require a Website, Terms, and Privacy URL. If it asks you to verify ownership, follow its current URL verification instructions and host the exact generated verification file at the root of your own website. Do not rename or edit the downloaded file.

## Find the credentials

Copy the **Client Key** and **Client Secret** from the app credentials section. Do not paste them into this repository. You will store them in Apps Script Script Properties in guide 05.

## Sandbox versus production

Use sandbox/test access for your own approved test accounts while building. TikTok may require review before wider production use. A passed sandbox test does not automatically mean every account can use the app.
