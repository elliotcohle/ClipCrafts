#!/bin/bash
# Youtubator launcher for Linux/macOS terminal

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to that directory
cd "$SCRIPT_DIR"

# Run the launcher
node Youtubator.js
