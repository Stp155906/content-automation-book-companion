# Completed Single-Image Example

The same TikTok template used for a carousel also works for a single-image
draft. The only difference is that today's dated folder contains **one**
numbered image.

```text
Ready to Post/
  2026-11-24/
    01-tip.png
    post-copy.csv
```

Use this CSV shape:

```csv
Title,SEO Description,CTA
One simple content habit,"A short, useful explanation of the habit and why it helps.",Save this for your next content day.
```

## Setup rule

Do not make a second script just because there is one image. The existing
[`tiktok-carousel-draft-demo.gs`](../../templates/tiktok-carousel-draft-demo.gs)
automatically reads every consecutively numbered image beginning at `01`—one
image, six images, or seven images. It stops if a number is missing so it does
not accidentally create a partial draft.

