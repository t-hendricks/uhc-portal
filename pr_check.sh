#!/bin/bash
#
# Copyright (c) 2018 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# This script is executed by a Jenkins job for each change request. If it
# doesn't succeed the change won't be merged.


# todo - extract this to a make command / npm script (to possibly be run @ 'postinstall'/'prebuild'),
# todo - and vall it from a git-hook (at 'before-push'), or from the gitlab pipeline's test stage.
## mockdata check should be really fast
#mockdata/regenerate-clusters.json.sh
#if ! git diff --exit-code --stat mockdata/api/clusters_mgmt/v1/clusters.json mockdata/api/accounts_mgmt/v1/subscriptions.json; then
#  set +x
#  echo 'ERROR: Generated collection jsons out of date. ^^^'
#  echo '       => Run `mockdata/regenerate-clusters.json.sh` locally and commit the changes.'
#  exit 1
#fi
#
#make \
#  app


# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="uhc-portal"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/app-sre/uhc-portal"
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export APP_ROOT=$(pwd)
#16 is the default Node version. Change this to override it.
export NODE_BUILD_VERSION=16

# use a custom script instead of the default one ('build'),
# to avoid passing environment variables.
#BUILD_SCRIPT="build --mode=production --env api-env=staging"
#export NPM_BUILD_SCRIPT="$BUILD_SCRIPT"
#export YARN_BUILD_SCRIPT="$BUILD_SCRIPT"

COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master


# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
#API_ENV="staging"


set -exv

# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# todo - find out if this is necessary
# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $BUILD_RESULTS
