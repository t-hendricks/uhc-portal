#!/bin/bash
# Start insights-proxy with our config.
# This script replaces the builtin env.sh & run.sh scripts from insights-proxy.

set -e -u -o pipefail

cd "$(dirname "$0")"

echo Waiting on server and backend...
yarn wait-on http://localhost:8001/ http://localhost:8010/api

yarn stop-insights-proxy

case "$(uname -s)" in
    Linux*)
        OPTS="--net=host --env PLATFORM=linux";;
    Darwin*)
        OPTS="--env PLATFORM=darwin";;
    *)
        echo 'This only works on Linux or Darwin!'
        exit 1;;
esac

./podman-or-docker.sh run \
                      --rm --name insightsproxy \
                      --env CUSTOM_CONF=true --volume "$PWD"/../profiles/local-frontend.js:/config/spandx.config.js \
                      --security-opt label=disable \
                      $OPTS \
                      -p 1337:1337 \
                      docker.io/redhatinsights/insights-proxy
