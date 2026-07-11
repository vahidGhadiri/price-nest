#!/usr/bin/env bash
set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}Generating languages...${NC}"

node --import tsx "$ROOT_DIR/scripts/generate-langs.js"

echo -e "${GREEN}Done${NC}"
