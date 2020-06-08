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

# Were previously created this by `yarn config set cafile ~/RH-IT-Root-CA.crt`
# but it's not the right config and anyway don't want leftovers between jobs.
rm --verbose ~/.yarnrc || true

# Configure the cert required to connect to Nexus (yarn respects npm configs too).
# The file is placed there by
# https://gitlab.cee.redhat.com/app-sre/infra/blob/master/ansible/playbooks/roles/baseline/tasks/main.yml
export npm_config_cafile=/etc/pki/ca-trust/source/anchors/RH-IT-Root-CA.crt

# Run the checks:
make \
  lint \
  app \
  test \
  binaries
