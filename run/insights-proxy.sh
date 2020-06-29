#!/bin/bash
# Start insights-proxy with our config.
# This script replaces the builtin env.sh & run.sh scripts from insights-proxy.

set -e -u -o pipefail

cd "$(dirname "$0")"

echo Waiting on server and backend...
yarn wait-on http://localhost:8001/ http://localhost:8010/api

# If insights-proxy is already running, spandx will happily start on
# next available port, despite us requesting specific SPANDX_PORT.
yarn stop-insights-proxy
export SPANDX_PORT=1337
./check-spandx-port-available.js

case "$(uname -s)" in
    Linux*)
        OPTS="--net=host --env PLATFORM=linux";;
    Darwin*)
        OPTS="--env PLATFORM=darwin";;
    *)
        echo 'This only works on Linux or Darwin!'
        exit 1;;
esac

# insights-proxy container currently tends to not die when killed with SIGTERM.
# `podman run` may "detach" & exit, but container stays running,
# or may not exit at all!  So abort it ourselves.
trap 'echo Trapped SIGINT; yarn stop-insights-proxy' INT
trap 'echo Trapped SIGTERM; yarn stop-insights-proxy' TERM
trap 'echo Trapped SIGHUP; yarn stop-insights-proxy' HUP
trap 'yarn stop-insights-proxy' EXIT

# bash doesn't trap signals while a foreground command is running.
# Running in background + wait allows the trap to work.
./podman-or-docker.sh run \
                      --rm --name insightsproxy \
                      --add-host qa.foo.redhat.com:127.0.0.1 \
                      --env CUSTOM_CONF=true --volume "$PWD"/../profiles/local-frontend.js:/config/spandx.config.js \
                      --security-opt label=disable \
                      $OPTS \
                      -p 1337:1337 \
                      quay.io/redhat-sd-devel/insights-proxy:pull-33 &
child_pid=$!
wait $child_pid
