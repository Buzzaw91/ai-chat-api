#!/bin/bash

# Check if a file name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# Check if the specified file exists
if [ ! -f "$1" ]; then
    echo "File not found: $1"
    exit 1
fi

# Convert file contents to a single line string
content=$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' "$1")

# Echo the formatted content
echo "$content"
