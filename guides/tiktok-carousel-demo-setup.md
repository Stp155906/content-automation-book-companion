# TikTok Carousel Draft Demo Setup

This walkthrough uses the real-style demo script in [`../templates/tiktok-carousel-draft-demo.gs`](../templates/tiktok-carousel-draft-demo.gs). It creates a TikTok draft for you to finish on your phone. It does not automatically publish publicly.

## Before you copy the code

You need:

1. A Google Drive parent folder with a daily folder named `YYYY-MM-DD`.
2. Carousel images named `01.png`, `02.png`, `03.png`, and so on.
3. A `post-copy.csv` in the same daily folder with `Title`, `SEO Description`, and `CTA` columns.
4. A TikTok developer app with Login Kit and Content Posting API enabled.
5. A private relay that creates short-lived signed image URLs TikTok can fetch.

## Copy the demo

1. Open `script.google.com` and click **New project**.
2. Open the `Code.gs` file.
3. Replace everything in it with the contents of [`tiktok-carousel-draft-demo.gs`](../templates/tiktok-carousel-draft-demo.gs).
4. At the top of the code, replace every `REPLACE_THIS...` value with your own information.
5. Open **Project Settings** and set your time zone.
6. Copy the **Script ID** from Project Settings.
7. In TikTok Login Kit, set the redirect URI to `https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback`.

## Add the private values

In Apps Script, go to **Project Settings** then **Script properties**. Add these three property names and paste your own private values in the value box:

```text
TIKTOK_CLIENT_KEY
TIKTOK_CLIENT_SECRET
TIKTOK_RELAY_SECRET
```

Never paste those values in GitHub, a ChatGPT prompt, an ebook, a screenshot, or a public Google Doc.

## Test safely

1. Run `previewTodaysCarousel`. Read the returned folder, slide names, title, and description.
2. Run `startTikTokAuthorization`, copy the link it returns, open it, and approve the correct TikTok account.
3. Run `sendTodaysCarouselToTikTok` once.
4. Check your phone. TikTok should offer the draft/edit flow.
5. Only after a successful test, run `installDailyMorningTrigger` once to schedule it.

## If you edit today's post after it was sent

This demo records the image and CSV update times. A changed file creates a new fingerprint and can be sent again deliberately. Do not keep pressing send: check the phone after each test.
