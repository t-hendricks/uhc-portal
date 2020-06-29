#!/bin/bash
# Run selenium tests.  Any args are passed on to cucumber.

set -e -u -o pipefail

cd "$(dirname "$0")"

. ./selenium-tests.version.sh

echo Waiting on insights-proxy and selenium...
yarn wait-on http-get://localhost:4444/wd/hub
./wait-on-insights-proxy.js

# Default must match selenium-browser.sh
BROWSER="${BROWSER:-firefox}"
export BUSHSLICER_CONFIG="{\"global\": {\"browser\": \"$BROWSER\"}}"

if [ -n "${UNATTENDED-}" ]; then
  FLAGS=('--profile=_debug' '--profile=junit')
else
  FLAGS=()
fi

mkdir -p ./output

CUCUMBER_COMMAND=(
  env BUSHSLICER_CONFIG="$BUSHSLICER_CONFIG"
  bundle exec cucumber "${FLAGS[@]}"
  # See comment about --guess in our-tests/features/step-definitions/ocm.rb
  --verbose --require=features/ --require=our-tests/features/ --guess
  our-tests/features/ocm/login.feature "$@"
)

# See also Dockerfile.selenium-tests.
# `--mount type=bind` works similarly on both docker and podman.
# This syntax doesn't support :z for SELinux relabeling, so need label=disable.
./podman-or-docker.sh run \
                      --rm --name selenium-test \
                      --interactive \
                      --net=host \
                      --security-opt label=disable \
                      --mount type=bind,src="$PWD/verification-tests",dst=/verification-tests,ro=true \
                      --mount type=bind,src="$PWD/private",dst=/verification-tests/private,ro=true \
                      --mount type=bind,src="$PWD/our-tests",dst=/verification-tests/our-tests,ro=true \
                      --mount type=bind,src="$PWD/output",dst=/output \
                      --user=root \
                      $SELENIUM_TESTS_IMAGE \
                      "${CUCUMBER_COMMAND[@]}"
