#!/bin/bash

# Use the GitHub MCP server outputs that are saved to /tmp
# We'll download them again using a different approach

echo "Downloading governance canons from GitHub..."

# List the files we need
declare -a files=(
  "GOVERNANCE_LIAISON_MINIMUM_REQUIREMENTS_VALIDATION.md"
  "GOVERNANCE_LIAISON_ROLE_SURVEY.md"
  "GOVERNANCE_LIAISON_TRAINING_PROTOCOL.md"
  "GOVERNANCE_BUILDER_SUBMISSION_SURVEY.md"
  "GOVERNANCE_CANON_MANIFEST.md"
  "GOVERNANCE_COMPLETENESS_MODEL.md"
  "GOVERNANCE_ENFORCEMENT_TRANSITION.md"
  "GOVERNANCE_LAYERDOWN_CONTRACT.md"
)

echo "Files to download: ${#files[@]}"
for file in "${files[@]}"; do
  echo "- $file"
done

