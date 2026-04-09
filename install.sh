#!/usr/bin/env bash
set -euo pipefail

# project-docs installer
#
# Usage:
#   curl -sL https://raw.githubusercontent.com/lea2696/project-docs/v2/install.sh | bash
#   curl -sL https://raw.githubusercontent.com/lea2696/project-docs/v2/install.sh | bash -s -- --prd path/to/prd.md
#   curl -sL https://raw.githubusercontent.com/lea2696/project-docs/v2/install.sh | bash -s -- --update
#
# Options:
#   --prd <path>        Path to a PRD file to seed documentation
#   --name <name>       Project name (skips prompt)
#   --update            Only update scripts and agent configs (preserves docs)
#   --non-interactive   Use defaults without prompting
#   --branch <branch>   Branch to install from (default: v2)

REPO="lea2696/project-docs"
BRANCH="v2"
UPDATE_MODE=false
INIT_ARGS=()

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --update)
      UPDATE_MODE=true
      shift
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --prd|--name)
      INIT_ARGS+=("$1" "$2")
      shift 2
      ;;
    --non-interactive)
      INIT_ARGS+=("$1")
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

TARBALL_URL="https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo ""
echo "📦 project-docs installer"
echo ""

# 1. Download and extract
echo "  Downloading from ${REPO}@${BRANCH}..."
curl -sL "$TARBALL_URL" | tar -xz -C "$TMPDIR"

# Find the extracted directory (GitHub names it repo-branch/)
EXTRACTED=$(ls -d "$TMPDIR"/*/ | head -1)
DIST_DIR="${EXTRACTED}dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "  ❌ dist/ directory not found in archive. Is this the right branch?"
  exit 1
fi

# 2. Copy files
if [ "$UPDATE_MODE" = true ]; then
  echo "  Running in update mode (preserving doc content)..."
  echo ""

  # Only update infrastructure files
  INFRA_DIRS=("scripts/docs" ".claude/agents" ".claude/rules" ".agents/skills")

  for dir in "${INFRA_DIRS[@]}"; do
    if [ -d "${DIST_DIR}/${dir}" ]; then
      mkdir -p "$dir"
      cp -r "${DIST_DIR}/${dir}/"* "$dir/" 2>/dev/null || true
      echo "  ✅ Updated: ${dir}/"
    fi
  done

  # Update settings.json only if hook config exists
  if [ -f "${DIST_DIR}/.claude/settings.json" ]; then
    if [ -f ".claude/settings.json" ]; then
      echo "  ⚠️  .claude/settings.json exists — not overwriting (check for hook updates manually)"
    else
      mkdir -p .claude
      cp "${DIST_DIR}/.claude/settings.json" .claude/settings.json
      echo "  ✅ Created: .claude/settings.json"
    fi
  fi

  echo ""
  echo "  ✅ Update complete! Infrastructure files refreshed."
  echo "  Doc content files were preserved."
  echo ""

else
  echo "  Installing to current directory..."
  echo ""

  # Copy everything from dist/, but don't overwrite existing files
  CREATED=0
  SKIPPED=0

  # Use find to get all files in dist/
  while IFS= read -r src_file; do
    rel_path="${src_file#${DIST_DIR}/}"
    dest_file="./${rel_path}"

    if [ -f "$dest_file" ]; then
      SKIPPED=$((SKIPPED + 1))
    else
      mkdir -p "$(dirname "$dest_file")"
      cp "$src_file" "$dest_file"
      CREATED=$((CREATED + 1))
    fi
  done < <(find "$DIST_DIR" -type f)

  echo "  Created: ${CREATED} files"
  echo "  Skipped: ${SKIPPED} files (already exist)"
  echo ""

  # 3. Run init if node is available
  if command -v node &>/dev/null; then
    node scripts/docs/init.mjs "${INIT_ARGS[@]+"${INIT_ARGS[@]}"}"
  else
    echo "  ⚠️  Node.js not found — skipping init."
    echo "  Run manually: node scripts/docs/init.mjs"
    echo ""
  fi
fi
