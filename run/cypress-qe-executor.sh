#!/bin/bash -e
# This script starts a podman pod that runs the Cypress tests.
# Specially designed for QE related pipeline runs.

#TODO: Replace them with QE specific credentials for tests.
export CYPRESS_TEST_WITHQUOTA_USER="${CYPRESS_TEST_WITHQUOTA_USER:-$TEST_SELENIUM_WITHQUOTA_USER}"
export CYPRESS_TEST_WITHQUOTA_PASSWORD="${CYPRESS_TEST_WITHQUOTA_PASSWORD:-$TEST_SELENIUM_WITHQUOTA_PASSWORD}"
export ELECTRON_RUN_AS_NODE=1

# Check that the required environment variables are set:
if [ -z "${CYPRESS_TEST_WITHQUOTA_USER}" ]; then
  echo "Environment variable 'CYPRESS_TEST_WITHQUOTA_USER' is mandatory."
  exit 1
fi
if [ -z "${CYPRESS_TEST_WITHQUOTA_PASSWORD}" ]; then
  echo "Environment variable 'CYPRESS_TEST_WITHQUOTA_PASSWORD' is mandatory."
  exit 1
fi

# Checks on Different flavours w.r.t ENVIRONMENT, BROWSER, TAGS
if [ $1 ]
then
  if [ $1 = 'staging' ]; then
    ENVIRONMENT="qaprodauth.console.redhat.com"
  elif [ $1 = 'production' ]; then
    ENVIRONMENT="console.redhat.com"
  elif [ $1 = 'production-beta' ]; then
    ENVIRONMENT="console.redhat.com/beta"
  else
    ENVIRONMENT="qaprodauth.console.redhat.com/beta"
  fi
fi
if [ $2 ]; then BROWSER="$2"; fi
if [ $3 ]; then TAGS="$3"; fi

echo "**************************************************************"
echo "** ENVIRONMENT under test : https://$ENVIRONMENT/openshift  **"
echo "** BROWSER under test     : $BROWSER  **"
echo "** Selected case tags are : $TAGS  **"
echo "**************************************************************"


cd "$(dirname "$(dirname "$0")")"  # repo root directory (above run/ that contains this script)

# Find the Jenkins build number that will be appended to the pod and container
# names, or else use the date if not running inside Jenkins:
build_number="${BUILD_NUMBER}"
if [ -z "${build_number}" ]; then
  build_number=$(date +%s)
fi

browser_container_name="cypress-tests-${build_number}";

# Cypress images with browser for containerized runs
browser_image="quay.io/openshifttest/cypress-included:10.9.0"

mkdir -p "${PWD}/cypress/videos"
mkdir -p "${PWD}/cypress/screenshots"
mkdir -p "${PWD}/run/output/embedded_files"

# Make sure that the pod is always removed:
function cleanup() {
  if [ ! -z "${pod_id}" ]; then
    # Collect the logs:
    if [ ! -z "${browser_container_id}" ]; then
      podman logs "${browser_container_name}"
      podman logs "${browser_container_name}" &> cypress-browser.log
      echo "copying cypress screenshots & videos to /run/output/embedded_files/..."
      podman cp "${browser_container_name}:/cypress/screenshots/" ${PWD}"/run/output/embedded_files/"
      podman cp "${browser_container_name}:/cypress/videos/" "${PWD}/run/output/embedded_files/"
    fi
    # Kill all the containers in the pod:
    podman pod rm --force "${pod_id}"
  fi
}
trap cleanup EXIT

# Create the initially empty pod for cypress runs.
pod_id=$(
  podman pod create \
    --name "cypress-${build_number}" \
    --add-host "qa.foo.redhat.com:127.0.0.1" \
    --add-host "prod.foo.redhat.com:127.0.0.1" \
    --add-host "registry-1.docker.io/v2/:127.0.0.0" \
    --publish "4444" \
    --publish "5900" \
    --share "net"
)

# Add to the pod the Cypress runner & start the runs.
browser_container_id=$(
  podman run \
    --pod "${pod_id}" \
    --name "${browser_container_name}" \
    --shm-size "2g" \
    --security-opt label="disable" \
    --volume "${PWD}/cypress.config.js:/cypress.config.js" \
    --volume "${PWD}/tsconfig.json:/tsconfig.json" \
    --volume "${PWD}/cypress:/cypress" \
    --volume "${PWD}/node_modules:/node_modules" \
    --env "CYPRESS_BASE_URL=https://${ENVIRONMENT}/openshift/" \
    --env "CYPRESS_TEST_WITHQUOTA_USER=${CYPRESS_TEST_WITHQUOTA_USER}" \
    --env "CYPRESS_TEST_WITHQUOTA_PASSWORD=${CYPRESS_TEST_WITHQUOTA_PASSWORD}" \
    --env NO_COLOR=1 \
    --env "CYPRESS_grepTags=${TAGS}" \
    --entrypoint=cypress \
    "${browser_image}" \
    run --browser ${BROWSER}
)