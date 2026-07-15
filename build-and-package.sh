#!/bin/bash

# Build and Package Script for DataStax Dashboard Application
# This script builds both the React SPA and Express BFF, then packages them into executables

set -e  # Exit on error

echo "======================================"
echo "DataStax Dashboard Build & Package"
echo "======================================"
echo ""

# Step 1: Build React SPA
echo "Step 1: Building React SPA..."
cd datastax-dashboard-spa
npm install
npm run build
echo "✓ React SPA built successfully"
echo ""

# Step 2: Build Express BFF
echo "Step 2: Building Express BFF..."
cd ../datastax-dashboard-bff
npm install
npm run build
echo "✓ Express BFF built successfully"
echo ""

# Step 3: Package with pkg
echo "Step 3: Packaging application..."
npm run package
echo "✓ Application packaged successfully"
echo ""

# Step 4: Ad-hoc sign the macOS binary (suppresses Gatekeeper warning for internal distribution)
MACOS_BIN="release/DataOnTheHouse-macos"
if [ -f "$MACOS_BIN" ]; then
  echo "Step 4: Ad-hoc signing macOS binary..."
  codesign --force --deep --sign - "$MACOS_BIN"
  echo "✓ macOS binary signed successfully"
  echo ""
else
  echo "⚠ macOS binary not found at $MACOS_BIN, skipping signing"
  echo ""
fi

echo "======================================"
echo "Build Complete!"
echo "======================================"
echo ""
echo "Executables created in: datastax-dashboard-bff/release/"
echo ""
echo "Available executables:"
echo "  - DataOnTheHouse-win.exe (Windows)"
echo "  - DataOnTheHouse-macos (macOS, ad-hoc signed)"
echo "  - DataOnTheHouse-linux (Linux)"
echo ""
echo "To run the application:"
echo "  Windows: ./datastax-dashboard-bff/release/DataOnTheHouse-win.exe"
echo "  macOS:   ./datastax-dashboard-bff/release/DataOnTheHouse-macos"
echo "  Linux:   ./datastax-dashboard-bff/release/DataOnTheHouse-linux"
echo ""
echo "The application will start on http://localhost:3000"
echo ""
echo "NOTE: macOS recipients must allow the app on first run:"
echo "  System Settings → Privacy & Security → 'Open Anyway'"
echo "  (required once per machine due to ad-hoc signing)"

# Made with Bob
