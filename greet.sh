#!/usr/bin/env bash
# greet.sh - build a friendly greeting message.

greet() {
  local name="${1:-}"
  if [ -z "$name" ]; then
    name="World"
  fi
  echo "Hello, ${name}!"
}

# Allow running this file directly: ./greet.sh Alice
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  greet "$1"
fi
