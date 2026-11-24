# Platform Expansion Planner: YouTube and Pinterest

This is a planning worksheet, not untested upload code. Add a platform only
after its official API, account authorization, and test upload are working.

## YouTube Shorts workflow

```text
SOURCE FOLDER:

INPUT:
Numbered images + post-copy.csv

RENDER STEP:
Turn the numbered images into one vertical MP4.

OUTPUT FILENAME:
YYYY-MM-DD-short.mp4

METADATA SOURCE:
Title and description from post-copy.csv

YOUTUBE PRIVACY FOR FIRST TEST:
Private

HUMAN CHECK BEFORE MAKING PUBLIC:
Watch the MP4, verify title/description, then change visibility.

FAILURE ALERT:
Email the owner with the upload error and Drive folder link.
```

## Pinterest single-image workflow

```text
SOURCE FOLDER:

INPUT:
One image and a Pinterest-specific CSV row.

CSV HEADERS:
Date, Image Filename, Pin Title, Description, SEO Keywords, Destination URL,
Published Status, Published At

BOARD:

DUPLICATE RULE:
Do not publish when Published Status is already "Published" or an API record
exists for the image file ID.

FIRST TEST:
Publish one private/test pin, then verify its board, image, title,
description, and destination link.

FAILURE ALERT:
Email the owner; leave Published Status unchanged.
```

## Truthful promise for the book

Different networks have different automation rules. TikTok's Upload API is a
draft-first flow: the creator gets a notification, then finishes in TikTok.
YouTube and Pinterest can have different publishing and review controls. The
system's promise is not "blindly publish everywhere"; it is to remove the
repetitive preparation, file handling, and upload steps while preserving the
creator's control.

