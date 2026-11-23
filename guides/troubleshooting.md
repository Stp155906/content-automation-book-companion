# Troubleshooting

## No TikTok notification

Check the Apps Script Executions page, the exact folder date, the correct TikTok account, and whether the workflow was skipped as a duplicate.

## No numbered slides found

Open today's exact date folder. Name the image files `01.png`, `02.png`, `03.png`, and so on without missing a number.

## TikTok cannot fetch an image URL

TikTok's server cannot always use a Google Drive preview link. Check that your private relay created a fresh signed URL that has not expired.

## TikTok login or redirect error

Check that the TikTok Client Key and redirect URI belong to the same TikTok developer app and that the redirect URI matches character for character.

## It sent yesterday's content

Fix the date-aware folder lookup. The automation should use today's exact folder in the configured time zone and never fall back to the newest or previous folder.
