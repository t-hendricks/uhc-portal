#!/bin/bash -e
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

# -----------------------------------------------------------------
# This script is executed by a Jenkins job upon merge to any of the
# long-lived deployment branches (i.e. master, candidate, stable).
# If it doesn't succeed the change won't be deployed.
# -----------------------------------------------------------------


# build app & push to image repository
# ------------------------------------

# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="uhc-portal"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/app-sre/uhc-portal"
export APP_ROOT=$(pwd)
# if running in jenkins, use the build's workspace
export WORKSPACE=${WORKSPACE:-$APP_ROOT}
export NODE_BUILD_VERSION=20

# determine the proper build script according to deployment-stage.
# $1 will contain the branch name passed to the jenkins job
# ($GIT_BRANCH is not populated on a manually triggered build).
# @see https://gitlab.cee.redhat.com/service/app-interface/-/blob/e468a1b9f15352ef56547b9cae3adf99e6c61d5b/resources/jenkins/ocm-ui/job-templates.yaml#L59-79
if [ "$GIT_BRANCH" == 'origin/stable' ] || [ "$1" == "stable" ]; then
  BUILD_SCRIPT='build:saas:production'
else
  BUILD_SCRIPT='build:saas:staging'
fi
export YARN_BUILD_SCRIPT="$BUILD_SCRIPT"


COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# send docker teardown status
exit $BUILD_RESULTS
