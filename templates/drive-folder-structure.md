# Google Drive Folder Structure

Make one parent folder for one content workflow. Inside it, make one child folder for each day.

```text
Ready to Post/
  2026-11-23/
    01.png
    02.png
    03.png
    post-copy.csv
```

## Rules

1. Name each daily folder `YYYY-MM-DD`.
2. Name carousel slides `01.png`, `02.png`, `03.png`, and so on.
3. Keep `post-copy.csv` in the same daily folder.
4. Do not mix another niche, account, or old carousel in the same parent folder.
5. The automation should use the current date in your chosen time zone. It must not fall back to yesterday's folder.

For a single-image workflow, use one image file and the same `post-copy.csv` metadata file.
