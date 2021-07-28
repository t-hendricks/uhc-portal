#!/bin/bash
# Run selenium tests.  Any args are passed on to cucumber.

set -e -u -o pipefail

cd "$(dirname "$0")"

echo Waiting on selenium...
yarn wait-on http-get://localhost:4444/wd/hub

# Default must match selenium-browser.sh
BROWSER="${BROWSER:-firefox}"

# JavaScript tests

yarn run wdio