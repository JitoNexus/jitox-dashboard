#!/bin/bash

# Change to the repository directory
cd "$(dirname "$0")"

# Add all changes
git add .

# Create commit with timestamp
timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
git commit -m "Auto-update: $timestamp"

# Push changes
git push origin main 