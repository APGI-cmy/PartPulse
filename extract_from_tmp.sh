#!/bin/bash
# Extract content from tmp files
tail -n +2 /tmp/1770202735689-copilot-tool-output-xqvvwu.txt > governance/canon/GOVERNANCE_LIAISON_MINIMUM_REQUIREMENTS_VALIDATION.md
tail -n +2 /tmp/1770202735755-copilot-tool-output-xsytdh.txt > governance/canon/GOVERNANCE_LIAISON_ROLE_SURVEY.md
tail -n +2 /tmp/1770202735845-copilot-tool-output-i8lmie.txt > governance/canon/GOVERNANCE_LIAISON_TRAINING_PROTOCOL.md
tail -n +2 /tmp/1770202745928-copilot-tool-output-mw8ijl.txt > governance/canon/GOVERNANCE_BUILDER_SUBMISSION_SURVEY.md
tail -n +2 /tmp/1770202745993-copilot-tool-output-y28cww.txt > governance/canon/GOVERNANCE_CANON_MANIFEST.md
tail -n +2 /tmp/1770202746085-copilot-tool-output-bchsee.txt > governance/canon/GOVERNANCE_COMPLETENESS_MODEL.md
tail -n +2 /tmp/1770202746178-copilot-tool-output-2gqpss.txt > governance/canon/GOVERNANCE_ENFORCEMENT_TRANSITION.md
tail -n +2 /tmp/1770202746228-copilot-tool-output-95g1lv.txt > governance/canon/GOVERNANCE_LAYERDOWN_CONTRACT.md

echo "✅ All files extracted"
ls -lh governance/canon/GOVERNANCE_*.md | tail -9
