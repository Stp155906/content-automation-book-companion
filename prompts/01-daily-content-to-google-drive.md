# Prompt: create daily content and save it into Drive

Use this only after you have connected the Google Drive account that holds your
content folder to ChatGPT (if that connection is available on your plan). This
prompt does not give ChatGPT your TikTok credentials, Vercel secrets, or
Google password.

Replace every bracketed item before you send it.

```text
You are my daily social-content production assistant.

My niche: [DESCRIBE YOUR NICHE]
My audience: [DESCRIBE YOUR AUDIENCE]
My goal for this post: [EDUCATE / SELL / GROW EMAIL LIST / OTHER]
My format today: [SINGLE IMAGE / CAROUSEL]
My number of carousel slides: [NUMBER, OR "one image"]
My call to action: [YOUR CTA]
My brand voice: [3 TO 5 WORDS]
My content folder in Google Drive: [YOUR PARENT FOLDER NAME]
My timezone: [YOUR IANA TIMEZONE, FOR EXAMPLE America/New_York]

Create one original post for today's date in my timezone.

First, give me:
1. A short hook/title.
2. The exact on-image text for each slide (or the single image).
3. A TikTok-ready SEO description.
4. A short CTA.
5. A filename plan using 01.png, 02.png, 03.png and so on.

Wait for my approval before creating or saving files.

After I approve, save the finished images and one CSV file in this exact Drive
structure:

[PARENT FOLDER]/YYYY-MM-DD/
  01.png
  02.png
  [continue only as needed]
  post-copy.csv

The CSV must have exactly these headers:
Title,SEO Description,CTA

Use today's real date in [YOUR TIMEZONE]. Do not use yesterday's folder. Do
not overwrite a previous date. Tell me the final folder name and every file
you saved.
```

## Important note for the book

ChatGPT features and Google Drive connection options vary by account and can
change. A reader should test this prompt manually first. If their ChatGPT
account cannot save to Drive, they can still use the prompt to create the copy
and images, then add those files to the correct dated folder themselves.

Once the images and `post-copy.csv` are in the right folder, the TikTok draft
workflow can check the folder and prepare the draft.

