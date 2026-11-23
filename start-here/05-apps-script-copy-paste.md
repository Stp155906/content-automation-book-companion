# 05 Apps Script Copy Paste

## Create the project

1. Go to `script.google.com`.
2. Click **New project**.
3. Rename it for this one workflow only.
4. Open **Project Settings** using the gear icon.
5. Set the timezone to the timezone you use for content. Example: `America/Aruba`.
6. Copy the **Script ID**. You need it for TikTok Login Kit.

## Paste the complete script

1. Open [`../templates/tiktok-carousel-draft-demo.gs`](../templates/tiktok-carousel-draft-demo.gs).
2. Click **Raw**, select all text, and copy it.
3. Return to Apps Script and open `Code.gs`.
4. Select everything in `Code.gs`, delete it, and paste the complete demo.
5. Click **Save**.

## Replace the visible settings

At the top of the script, replace only these values:

| In the code | What to paste |
| --- | --- |
| `DRIVE_PARENT_FOLDER_ID` | Your Drive parent folder ID, not the full URL. |
| `TIME_ZONE` | Your IANA time zone, such as `America/Aruba`. |
| `ALERT_EMAIL` | The inbox you check daily. |
| `RELAY_BASE_URL` | Your Vercel production URL, beginning with `https://`. |
| `TIKTOK_REDIRECT_URI` | Your exact callback URI with your Script ID inserted. |
| `atHour(9)` | Your preferred daily hour from 0 to 23. |

## Add the invisible private settings

In Apps Script, click the gear icon, open **Project Settings**, scroll to **Script properties**, and click **Add script property**. Add each name exactly as written:

| Property name | Paste from |
| --- | --- |
| `TIKTOK_CLIENT_KEY` | TikTok Developer app credentials |
| `TIKTOK_CLIENT_SECRET` | TikTok Developer app credentials |
| `TIKTOK_RELAY_SECRET` | The same random secret you added in Vercel |

Do not paste these values into `Code.gs`. Do not put them in GitHub.

## Approve Google permissions

The first time you run a function, Google asks for permissions. The script needs Drive access to read your images, URL Fetch access to call TikTok and Vercel, and Mail access to send your alert email. Approve only after confirming you are in the correct Google account and the code is your own copy.
