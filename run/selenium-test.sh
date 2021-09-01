#!/bin/bash
# Run selenium tests.  Any args are passed on to wdio.

set -e -u -o pipefail

cd "$(dirname "$0")"

echo Waiting on selenium browser...
yarn wait-on http-get://localhost:4444/wd/hub

# Default must match selenium-browser.sh
BROWSER="${BROWSER:-firefox}"

# JavaScript tests

yarn run wdio "$@"
