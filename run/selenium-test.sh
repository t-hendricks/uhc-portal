#!/bin/bash
# Run selenium tests.  Any args are passed on to wdio.  $WDIO_ARGS are also passed to it.

set -e -u -o pipefail

cd "$(dirname "$0")"

if [ -z "${TEST_SELENIUM_WITHQUOTA_USER-}" -o -z "${TEST_SELENIUM_WITHQUOTA_PASSWORD-}" ]; then
  echo "Error: TEST_SELENIUM_WITHQUOTA_USER and TEST_SELENIUM_WITHQUOTA_PASSWORD env vars are required."
  exit 2
fi

TEST_SELENIUM_WD_HOSTNAME="${TEST_SELENIUM_WD_HOSTNAME:-localhost}"
TEST_SELENIUM_WD_PORT="${TEST_SELENIUM_WD_PORT:-4444}"

echo Waiting on selenium browser...
yarn wait-on "http-get://${TEST_SELENIUM_WD_HOSTNAME}:${TEST_SELENIUM_WD_PORT}/wd/hub/status"

# Default must match selenium-browser.sh
export BROWSER="${BROWSER:-firefox}"

# JavaScript tests

yarn run wdio --hostname="${TEST_SELENIUM_WD_HOSTNAME}" --port="${TEST_SELENIUM_WD_PORT}" ${WDIO_ARGS:-} "$@"