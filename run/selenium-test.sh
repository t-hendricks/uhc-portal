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
export BUSHSLICER_CONFIG="{
  \"environments\": {
    \"ocm_local_dev_prod_sso\": {
      \"static_users_map\": {
        \"regularUser\": \"$TEST_SELENIUM_WITHQUOTA_USER:$TEST_SELENIUM_WITHQUOTA_PASSWORD\",
        \"noAnyQuotaUser\": \"$TEST_SELENIUM_NOANYQUOTA_USERNAME:$TEST_SELENIUM_NOANYQUOTA_PASSWORD\"
      }
    }
  },
  \"global\": {
    \"browser\": \"$BROWSER\",
    \"default_environment\": \"ocm_local_dev_prod_sso\"
  }
}"
export BUSHSLICER_DEFAULT_ENVIRONMENT=ocm_local_dev_prod_sso

if [ -n "${UNATTENDED-}" ]; then
  FLAGS=('--profile=_debug' '--profile=junit')
else
  FLAGS=()
fi

mkdir -p ./output

CUCUMBER_COMMAND=(
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
                      --env BUSHSLICER_CONFIG \
                      --env BUSHSLICER_DEFAULT_ENVIRONMENT \
                      $SELENIUM_TESTS_IMAGE \
                      "${CUCUMBER_COMMAND[@]}"

# now run javascript tests
yarn run wdio 