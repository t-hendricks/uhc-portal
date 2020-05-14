#!/bin/bash
# Start insights-proxy with our config.

set -e -u -o pipefail

cd "$(dirname "$0")"

echo Waiting on server and backend...
yarn wait-on http://localhost:8001/ http://localhost:8010/api

yarn stop-insights-proxy

# Need env.sh to set PLATFORM var for passing into container.
# Apply our RUNNER default before env.sh makes it default to docker.
export RUNNER=${RUNNER:-podman}
source ./insights-proxy/scripts/env.sh

./podman-or-docker.sh run \
                      --rm --name insightsproxy \
                      --env CUSTOM_CONF=true --volume "$PWD"/../profiles/local-frontend.js:/config/spandx.config.js \
                      --security-opt label=disable \
                      --env PLATFORM --net=host \
                      -p 1337:1337 \
                      docker.io/redhatinsights/insights-proxy
