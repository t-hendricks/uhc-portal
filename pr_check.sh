#!/bin/bash -ex
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

# Run the checks:

mockdata/regenerate-clusters.json.sh # first because really fast

make \
  js-lint \
  app \
  test \
  binaries

# Selenium tests
# --------------
function finish() {
  # Commands here should always return 0, to retain exit code from the test.

  # Don't leave run-away containers.
  yarn stop || true
  run/podman-or-docker.sh ps --all || true
  pgrep --full --list-full spandx || true
}
trap finish EXIT

# Comes from Vault, see
# https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/resources/jenkins/uhc/secrets.yaml
export UHC_TOKEN=$TEST_SELENIUM_NOANYQUOTA_OFFLINE_TOKEN
export UNATTENDED=1
export FORCE_COLOR=1

# If test gets stuck, stop after realistic time.
# Jenkins aborting after 30min is wasteful and doesn't
# give our `finish` function enough time to clean up.
timeout --signal=TERM --kill-after=2m 5m yarn e2e-test-run

make \
  go-lint
