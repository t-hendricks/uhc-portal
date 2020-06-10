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

# The cert required to connect to Nexus is already in system CA store per:
# https://gitlab.cee.redhat.com/app-sre/infra/blob/master/ansible/playbooks/roles/baseline/tasks/main.yml
ls -l /etc/pki/ca-trust/source/anchors/RH-IT-Root-CA.crt
yarn config list

# Run the checks:
make \
  lint \
  app \
  test \
  binaries
