# 06 Connect Test Schedule

Do these in order. Do not create a schedule before the manual test succeeds.

## 1 Preview only

In Apps Script, choose `previewTodaysCarousel` from the function menu and click **Run**. Open the execution result. It must show today's correct folder, every slide in the right order, and the correct title and caption.

If it shows yesterday's folder, stop. Fix your folder name or time zone before continuing.

## 2 Connect TikTok

1. Choose `startTikTokAuthorization` and click **Run**.
2. Copy the link returned in the execution log.
3. Open it in the browser profile that is signed into the intended TikTok account.
4. Approve the permissions.
5. Return to Apps Script after the success message.

## 3 Send one test draft

Choose `sendTodaysCarouselToTikTok` and click **Run** one time. Check the intended TikTok account on your phone. Open the notification or inbox item, add music and final edits if you want, then post manually.

If the execution log says `already_sent`, it is protecting you from a duplicate. Edit a file only if you intentionally want a new fingerprint and another test.

## 4 Create the daily trigger

Only after a successful test, choose `installDailyMorningTrigger` and click **Run** once. It removes any older trigger for the same function and creates one daily trigger.

Apps Script can run within the chosen hour window rather than at the exact minute. That is normal.

## 5 Check alerts

For a safe test, temporarily make a copy of a dated folder with a missing `post-copy.csv`, or run the script before today's content exists. Confirm the alert email arrives. Then restore your normal content structure.

## Daily owner check

Each morning, glance at the expected TikTok notification. If it is missing, check the alert email and Apps Script **Executions** page before changing anything.
