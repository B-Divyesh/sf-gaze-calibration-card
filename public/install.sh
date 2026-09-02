#!/bin/sh
set -eu

MANIFEST_URL="https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/latest/download/latest.json"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT INT TERM

OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS:$ARCH" in
  Darwin:arm64|Darwin:aarch64) KEY="macos-aarch64" ;;
  Darwin:x86_64) KEY="macos-x86_64" ;;
  Linux:x86_64|Linux:amd64) KEY="linux-x86_64" ;;
  *) echo "Gaze Calibration Card does not have an installer for $OS $ARCH yet." >&2; exit 1 ;;
esac

curl -fsSL "$MANIFEST_URL" -o "$TEMP_DIR/latest.json"
ENTRY="$(sed -n "/\"$KEY\"[[:space:]]*:/,/^[[:space:]]*}/p" "$TEMP_DIR/latest.json")"
URL="$(printf '%s\n' "$ENTRY" | sed -n 's/.*"url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
EXPECTED="$(printf '%s\n' "$ENTRY" | sed -n 's/.*"sha256"[[:space:]]*:[[:space:]]*"\([a-f0-9]*\)".*/\1/p')"
if [ -z "$URL" ] || [ -z "$EXPECTED" ]; then echo "The release manifest is missing $KEY." >&2; exit 1; fi

ASSET="$TEMP_DIR/$(basename "$URL")"
curl -fL "$URL" -o "$ASSET"
if command -v shasum >/dev/null 2>&1; then ACTUAL="$(shasum -a 256 "$ASSET" | awk '{print $1}')"; else ACTUAL="$(sha256sum "$ASSET" | awk '{print $1}')"; fi
if [ "$ACTUAL" != "$EXPECTED" ]; then echo "Checksum verification failed; nothing was installed." >&2; exit 1; fi

if [ "$OS" = "Darwin" ]; then
  DESTINATION="${TMPDIR:-/tmp}/Gaze-Calibration-Card.dmg"
  cp "$ASSET" "$DESTINATION"
  open "$DESTINATION"
  echo "Verified the SHA256 checksum and opened $DESTINATION. Drag Gaze Calibration Card to Applications."
  echo "This macOS app bundle is unsigned."
else
  INSTALL_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
  mkdir -p "$INSTALL_DIR"
  DESTINATION="$INSTALL_DIR/gaze-calibration-card"
  cp "$ASSET" "$DESTINATION"
  chmod +x "$DESTINATION"
  echo "Verified the SHA256 checksum and installed the AppImage to $DESTINATION."
  case ":$PATH:" in *":$INSTALL_DIR:"*) ;; *) echo "Add $INSTALL_DIR to PATH to launch it by name." ;; esac
fi
