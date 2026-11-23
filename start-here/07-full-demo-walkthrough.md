# 07 Full Demo Walkthrough

This is what a normal successful day looks like.

1. Your parent Drive folder is named `Ready to Post`.
2. Inside it, you create `2026-11-23` because that is today's date in your script's timezone.
3. You add `01.png`, `02.png`, `03.png`, and `post-copy.csv`.
4. You open Apps Script and run `previewTodaysCarousel`.
5. The result says it found the folder `2026-11-23`, three slides in order, and the caption you expect.
6. On the first day only, you run `startTikTokAuthorization`, open the returned link, and approve the intended TikTok account.
7. You run `sendTodaysCarouselToTikTok` one time.
8. The script places temporary protected copies of the three images in your private relay.
9. TikTok fetches those temporary links and sends the draft/edit item to the connected TikTok account.
10. You open TikTok on your phone, review the carousel, add music or edit if desired, and publish manually.
11. The script saves a private status file inside that date folder so it does not send the identical files twice.
12. Later, the relay deletes its temporary copies.

## If a file is missing

The script stops. It emails the alert address instead of guessing or using yesterday's content. That is correct behavior.
