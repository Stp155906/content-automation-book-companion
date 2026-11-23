# 02 Google Drive and CSV

The script only works when your files are organized in the same predictable way every day.

## Make the parent folder

1. Open Google Drive.
2. Click **New** then **Folder**.
3. Name it for one workflow only, such as `Ready to Post`.
4. Open the folder.
5. Copy the long folder ID from the browser address after `/folders/`.
6. Paste that value into `DRIVE_PARENT_FOLDER_ID` in the script later.

Do not paste the full link. Paste only the ID.

## Make today's folder

Inside the parent folder, create one folder named exactly like today's date:

```text
2026-11-23
```

The script uses the timezone inside its configuration to decide what today's date is. It will not use a previous folder as a fallback.

## Add the carousel files

Put these files inside today's folder:

```text
2026-11-23/
  01.png
  02.png
  03.png
  post-copy.csv
```

You can use PNG, JPG, JPEG, or WEBP images. Name the slides with consecutive two-digit numbers starting at `01`. The names `01.png`, `01-intro.png`, and `01_intro.png` all work. A gap such as `01`, `02`, `04` stops the script and emails you.

## Make post-copy.csv

Open [`../templates/post-copy-template.csv`](../templates/post-copy-template.csv) in GitHub. Copy the two rows into a new Google Sheet. Replace the example words with your own. Then click **File**, **Download**, and **Comma-separated values (.csv)**. Name the download `post-copy.csv`.

Place it inside the exact same dated folder as the images.

The required columns are:

| Column | Used for |
| --- | --- |
| `Title` | TikTok photo title. Keep it under 90 characters. |
| `SEO Description` | Main caption text. |
| `CTA` | Call to action added below the caption. |

## Before you run the script

Open today's folder and check: one dated folder, all numbered images, and one `post-copy.csv`. If any item is not ready, wait. Do not send a partial post.
