#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source greet.sh

pass=0
fail=0

assert_eq() {
  local expected="$1" actual="$2" desc="$3"
  if [ "$expected" = "$actual" ]; then
    echo "ok - $desc"
    pass=$((pass+1))
  else
    echo "FAIL - $desc (expected '$expected', got '$actual')"
    fail=$((fail+1))
  fi
}

assert_eq "Hello, Alice!" "$(greet Alice)" "greets a given name"
assert_eq "Hello, World!" "$(greet)" "defaults to World when no name is given"

echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
