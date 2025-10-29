#!/bin/bash
# TakeMachine launcher for macOS
# This script can be executed by double-clicking in Finder

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to that directory
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

# Run the launcher
node TakeMachine.js

# Keep terminal open if there was an error
if [ $? -ne 0 ]; then
    echo ""
    echo "Press any key to exit..."
    read -n 1
fi
