# 01 Before You Start

This is a draft-first TikTok carousel automation. It does not post publicly by itself. It sends a photo carousel to TikTok's Upload to TikTok flow, then you open TikTok on your phone, add music or edits if wanted, and post manually.

## What you need

| Item | Why you need it |
| --- | --- |
| Desktop browser | Google Apps Script and TikTok developer settings are much easier on a computer. |
| One Google account | It owns or can edit the content folders and Apps Script project. |
| One TikTok account | It approves the connection and receives the draft. |
| TikTok developer account | It supplies Login Kit and Content Posting API access. |
| Vercel account | It hosts the tiny private media relay. |
| An alert email | It tells you immediately when today's content is missing or a run fails. |

## What this workflow does not need

- A public uploader dashboard.
- Direct Post permission.
- Google Drive sharing links for TikTok to fetch.
- Your computer to stay on after the daily trigger is installed.

## Keep these three areas separate

1. **Public GitHub:** safe templates, examples, and prompts only.
2. **Private Apps Script properties:** TikTok secret, relay secret, and saved TikTok token.
3. **Private Vercel environment variables:** relay secret and Vercel Blob storage connection.

If you are unsure whether something is private, treat it as private.
