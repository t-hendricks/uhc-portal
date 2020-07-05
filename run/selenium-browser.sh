#!/bin/bash
# Launch one of the https://github.com/SeleniumHQ/docker-selenium containers
#
# "standalone-" containers skip the "grid"->"node" infrastructure,
# run a single browser, with minimal API on http://localhost:4444/wd/hub.
#
# "-debug" containers support VNC for debugging (see selenium.vnc).

set -e -u -o pipefail

cd "$(dirname "$0")"

# Default must match selenium-test.sh
BROWSER="${BROWSER:-firefox}"

set -x
./podman-or-docker.sh run \
                      --rm --name=browser \
                      --add-host qa.foo.redhat.com:127.0.0.1 \
                      --add-host prod.foo.redhat.com:127.0.0.1 \
                      --net=host -p 4444:4444 -p 5900:5900 \
                      --volume /dev/shm:/dev/shm \
                      docker.io/selenium/standalone-"$BROWSER"-debug
