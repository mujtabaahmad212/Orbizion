#!/bin/sh
# Compress a source video for the Orbizion homepage.
# Usage: ./scripts/compress-videos.sh input.mp4 output-base
# Produces output-base.mp4 (H.264, 720p, CRF 23, faststart, no audio)
# plus output-base-poster.jpg (1280px frame at 1.5s).
# Both homepage videos are muted autoplay, so audio is dropped on purpose.
# Why 720p CRF 23, not 1080p? Tested Nov 2026: 1080p CRF 22 was 7.2 MB
# for the hero video, VP9 WebM was 6.5 MB, while 720p CRF 23 was 2.7 MB
# and a frame-by-frame check looked identical at display size, because
# the video is a background/showcase element under a gradient overlay.
# Never commit a video over 5 MB, and never commit a duplicate copy.
set -e
SRC="$1"; BASE="$2"
if [ -z "$SRC" ] || [ -z "$BASE" ]; then echo "Usage: $0 input.mp4 output-base"; exit 1; fi
ffmpeg -y -v error -i "$SRC" -vf scale=1280:-2 -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -movflags +faststart -an "${BASE}.mp4"
ffmpeg -y -v error -ss 1.5 -i "$SRC" -frames:v 1 -vf scale=1280:-2 -q:v 3 "${BASE}-poster.jpg"
ls -lh "${BASE}.mp4" "${BASE}-poster.jpg"
