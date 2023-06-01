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

# mockdata check should be really fast
mockdata/regenerate-clusters.json.sh
if ! git diff --exit-code --stat mockdata/api/clusters_mgmt/v1/clusters.json mockdata/api/accounts_mgmt/v1/subscriptions.json; then
  set +x
  echo 'ERROR: Generated collection jsons out of date. ^^^'
  echo '       => Run `mockdata/regenerate-clusters.json.sh` locally and commit the changes.'
  exit 1
fi

make \
  app
