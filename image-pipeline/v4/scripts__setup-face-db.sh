#!/bin/bash

##
# Setup script for face detection database and models.
#
# Creates:
#   - data/face-models/         — face-api.js model files (ssd_mobilenetv1, face_landmark_68, face_recognition)
#   - data/face-db/moe/         — directory for Moe reference photos
#   - data/face-db/.gitkeep     — git marker
#
# Usage:
#   bash scripts__setup-face-db.sh
#
# After running:
#   1. Add 5-10 reference photos of Moe to data/face-db/moe/
#      (clear face, varied angles/lighting, no sunglasses)
#   2. Run: npx tsx image-pipeline/v4/scripts__build-face-db.ts moe
#   3. Verify: cat data/face-db/moe.json
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODELS_DIR="${SCRIPT_DIR}/data/face-models"
DB_DIR="${SCRIPT_DIR}/data/face-db"
MOE_DIR="${DB_DIR}/moe"

echo "================================"
echo "Face Detection Database Setup"
echo "================================"
echo ""

# Create directories
echo "[1/4] Creating directories..."
mkdir -p "$MODELS_DIR"
mkdir -p "$MOE_DIR"
touch "${DB_DIR}/.gitkeep"
echo "✓ Created $MODELS_DIR"
echo "✓ Created $MOE_DIR"
echo ""

# Download face-api.js models
echo "[2/4] Downloading face-api.js models..."
echo "      (This may take a few minutes on first run)"
echo ""

# Model download URLs (official face-api.js CDN)
# These are compressed .bin files (single format, not shards)
declare -A MODELS=(
  ["ssd_mobilenetv1"]="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/"
  ["face_landmark_68"]="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/"
  ["face_recognition"]="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/"
)

# Download ssd_mobilenetv1
echo "  Downloading ssd_mobilenetv1..."
curl -fsSL \
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/ssd_mobilenetv1_model.weights.bin" \
  -o "${MODELS_DIR}/ssd_mobilenetv1_model.weights.bin" 2>/dev/null || \
  echo "    ⚠ Failed to download ssd_mobilenetv1, continuing..."

# Download face_landmark_68
echo "  Downloading face_landmark_68..."
curl -fsSL \
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/face_landmark_68_model.weights.bin" \
  -o "${MODELS_DIR}/face_landmark_68_model.weights.bin" 2>/dev/null || \
  echo "    ⚠ Failed to download face_landmark_68, continuing..."

# Download face_recognition
echo "  Downloading face_recognition..."
curl -fsSL \
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/face_recognition_model.weights.bin" \
  -o "${MODELS_DIR}/face_recognition_model.weights.bin" 2>/dev/null || \
  echo "    ⚠ Failed to download face_recognition, continuing..."

echo ""
echo "✓ Model download attempted"
echo ""

# Create reference photo instructions
echo "[3/4] Creating reference photo guide..."
cat > "${MOE_DIR}/README.md" << 'EOF'
# Moe Reference Photos

Add 5-10 reference photos of Moe to this directory for face descriptor extraction.

## Requirements

- **Clear face:** Face should be clearly visible and not obscured
- **Varied angles:** Include photos from different angles (front, 3/4, slightly side)
- **Varied lighting:** Different lighting conditions (daylight, indoor, shadows)
- **Varied expressions:** Neutral, smiling, different expressions
- **Format:** JPG, PNG, or WebP
- **No sunglasses:** Avoid photos where eyes are hidden
- **Single subject:** Photos of Moe alone (or clearly identifiable even in group shots)

## Typical setup

```
moe/
├── ref01.jpg   (front, daylight)
├── ref02.jpg   (3/4 angle, daylight)
├── ref03.jpg   (side angle, indoor)
├── ref04.jpg   (front, smiling)
├── ref05.jpg   (3/4 angle, indoor)
├── ref06.jpg   (slightly different lighting)
└── ref07.jpg   (optional: additional variation)
```

## Building the database

After adding reference photos, run:

```bash
npx tsx image-pipeline/v4/scripts__build-face-db.ts moe
```

This will:
1. Load all `.jpg`, `.jpeg`, `.png`, `.webp` files
2. Detect face(s) in each photo
3. Compute 128-dimensional face descriptors
4. Save to `data/face-db/moe.json`

## Privacy & Security

- **Team members only:** Reference photos should only be of team members
- **No third parties:** Do not add photos of other people
- **Secure storage:** Keep `data/face-db/` private (not committed to public repos without care)
- **Threshold:** Default threshold is euclidean distance < 0.5 (stricter than face-api.js default)

## Troubleshooting

If no descriptors are computed:
- Check that faces are clearly visible
- Ensure photos are in supported format (JPG, PNG, WebP)
- Try photos with more neutral lighting
- Check console output for specific errors: `npx tsx image-pipeline/v4/scripts__build-face-db.ts moe --verbose`

## Model versions

- Detection: ssd_mobilenetv1 (SSD MobileNet v1)
- Landmarks: face_landmark_68 (68-point face landmarks)
- Recognition: face_recognition (ResNet-based, 128-d descriptor)

All models from @vladmandic/face-api.js v1.7.13
EOF

echo "✓ Created ${MOE_DIR}/README.md"
echo ""

# Check if models are present
echo "[4/4] Checking model files..."
MISSING=0
for model in "ssd_mobilenetv1_model.weights.bin" "face_landmark_68_model.weights.bin" "face_recognition_model.weights.bin"; do
  if [ -f "${MODELS_DIR}/${model}" ]; then
    size=$(du -h "${MODELS_DIR}/${model}" | cut -f1)
    echo "  ✓ ${model} (${size})"
  else
    echo "  ✗ ${model} (NOT FOUND)"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""

if [ $MISSING -eq 0 ]; then
  echo "✅ All models downloaded successfully"
else
  echo "⚠️  ${MISSING} model(s) missing. Manual setup required:"
  echo ""
  echo "   Models must be placed in: ${MODELS_DIR}/"
  echo ""
  echo "   Download from:"
  echo "   https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/"
  echo ""
fi

echo "Next steps:"
echo "  1. Add 5-10 reference photos of Moe to:"
echo "     ${MOE_DIR}/"
echo ""
echo "  2. Build the face database:"
echo "     npx tsx image-pipeline/v4/scripts__build-face-db.ts moe"
echo ""
echo "  3. Verify the database:"
echo "     cat data/face-db/moe.json"
echo ""
echo "  4. Detect Moe in images:"
echo "     npx tsx image-pipeline/v4/scripts__moe-detect-images.ts [folder]"
echo ""
