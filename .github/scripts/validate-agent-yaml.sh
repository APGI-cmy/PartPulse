#!/bin/bash
# Official YAML Frontmatter Validator for Agent Contracts
# Validates only the YAML frontmatter portion of agent contract markdown files
#
# Usage: ./validate-agent-yaml.sh
# Exit Code: 0 if all valid, 1 if any issues found
#
# This is the OFFICIAL validator for agent contracts per YAML Remediation Issue
# yamllint on full .md files will fail due to markdown syntax - use this instead

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
AGENTS_DIR="$REPO_ROOT/.github/agents"
TEMP_DIR="/tmp/yaml-frontmatter-validation-$$"
EXIT_CODE=0

# Clean and create temp directory
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "🔍 Validating YAML frontmatter in agent contracts..."
echo "============================================================"

for file in "$AGENTS_DIR"/*.md; do
    if [ ! -f "$file" ]; then
        continue
    fi

    filename=$(basename "$file")
    echo -n "Checking $filename... "

    # Extract YAML frontmatter (between first --- and second ---)
    awk '/^---$/{if(++n==2) exit} n==1' "$file" > "$TEMP_DIR/$filename.yaml"

    # Check if frontmatter was extracted
    if [ ! -s "$TEMP_DIR/$filename.yaml" ]; then
        echo "❌ No YAML frontmatter found"
        EXIT_CODE=1
        continue
    fi

    # Validate the extracted YAML with yamllint
    # Use a permissive config for frontmatter
    if ! yamllint "$TEMP_DIR/$filename.yaml" > "$TEMP_DIR/$filename.log" 2>&1; then
        echo "❌ YAML frontmatter has issues:"
        cat "$TEMP_DIR/$filename.log" | head -5
        EXIT_CODE=1
    else
        echo "✅"
    fi
done

echo "============================================================"
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All YAML frontmatter is valid"
else
    echo "❌ Some files have YAML frontmatter issues"
    echo ""
    echo "NOTE: This validator checks only YAML frontmatter (between --- markers)."
    echo "      Running 'yamllint .github/agents/*.md' on full files will fail"
    echo "      because yamllint treats markdown content as YAML."
fi

# Cleanup
rm -rf "$TEMP_DIR"

exit $EXIT_CODE
