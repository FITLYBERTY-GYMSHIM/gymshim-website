"""
Composites a portrait dashboard image onto the tablet/kiosk screen in the
GYMSHIM hero photo, using a perspective (homography) warp so it matches the
screen's tilt, then adds a subtle glass-reflection streak.

Usage:
    python3 generate_kiosk_composite.py

Requires: opencv-python, pillow, numpy
    pip install opencv-python pillow numpy --break-system-packages
"""

import cv2
import numpy as np
from PIL import Image

# ---- inputs ----
BG_PATH = "ChatGPT_Image_Aug_21__2026__05_11_54_PM.png"  # hero photo with the tablet
SCREEN_CONTENT_PATH = "Group_1.png"                       # portrait dashboard to place on screen
OUT_PATH = "gymshim_kiosk_hero_updated.png"

# ---- the 4 corners of the tablet's screen in the background photo ----
# Order: top-left, top-right, bottom-right, bottom-left
# (found by manual inspection with a pixel grid overlay — re-pick these if
# you use a different background photo / different tablet crop)
SCREEN_CORNERS = np.float32([
    [989, 137],   # top-left
    [1143, 122],  # top-right
    [1112, 499],  # bottom-right
    [973, 479],   # bottom-left
])

# nudge the quad outward slightly so the warp fully covers the bezel edge
# with no old-content sliver showing through
EXPAND = 1.02


def main():
    bg = cv2.imread(BG_PATH)
    h, w = bg.shape[:2]

    src_img = Image.open(SCREEN_CONTENT_PATH).convert("RGB")
    src = cv2.cvtColor(np.array(src_img), cv2.COLOR_RGB2BGR)
    sh, sw = src.shape[:2]

    src_pts = np.float32([[0, 0], [sw - 1, 0], [sw - 1, sh - 1], [0, sh - 1]])

    centroid = SCREEN_CORNERS.mean(axis=0)
    dst_pts = (SCREEN_CORNERS - centroid) * EXPAND + centroid

    # perspective warp of the dashboard image into the background's frame
    M = cv2.getPerspectiveTransform(src_pts, dst_pts.astype(np.float32))
    warped = cv2.warpPerspective(src, M, (w, h))

    # mask = filled screen quad, feathered a couple px at the edge
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillConvexPoly(mask, dst_pts.astype(np.int32), 255)
    mask = cv2.GaussianBlur(mask, (3, 3), 0)
    mask3 = cv2.merge([mask, mask, mask]).astype(np.float32) / 255.0

    comp = bg.astype(np.float32) * (1 - mask3) + warped.astype(np.float32) * mask3

    # subtle diagonal glass-reflection streak across the screen only
    x_idx, y_idx = np.meshgrid(np.arange(w), np.arange(h))
    streak_pos = x_idx * 0.6 + y_idx * 1.0
    streak = np.exp(-((streak_pos - 1750) ** 2) / (2 * 90 ** 2)) * 35
    add = streak * (mask.astype(np.float32) / 255.0)
    for c in range(3):
        comp[:, :, c] += add

    comp = np.clip(comp, 0, 255).astype(np.uint8)
    cv2.imwrite(OUT_PATH, comp)
    print(f"saved {OUT_PATH}")


if __name__ == "__main__":
    main()