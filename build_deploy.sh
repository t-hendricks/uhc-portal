#!/bin/bash -ex

# build app & push to image repository
# ------------------------------------

# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="uhc-portal"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/app-sre/uhc-portal"
# if running in jenkins, use the build's workspace
export WORKSPACE=${WORKSPACE:-$APP_ROOT}
export APP_ROOT=$(pwd)
# 16 is the default Node version. change this to override it
export NODE_BUILD_VERSION=16

COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# send docker teardown status
exit $BUILD_RESULTS
