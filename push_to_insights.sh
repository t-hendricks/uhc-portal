#!/bin/bash -ex
#
# Copyright (c) 2019 Red Hat, Inc.
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

# This script builds the OCM portal code and pushes it to the Insights
# deployment repositories. It is called via uhc-portal git hooks, when
# code is merged to master and stable branches. (Master gets deployed to
# prod-beta, and stable gets deployed to prod-stable.) See app-interface
# for the job definition:
# https://gitlab.cee.redhat.com/service/app-interface/blob/master/resources/jenkins/uhc/job-templates.yaml
#
#
# PUSH_KEY - Base64 encoded SSH private key used to push to the Insights
# platform git repository. Available in Jenkins via Vault. If you run this
# script locally for some reason, you must set PUSH_KEY.
#
# URL of the Insights deployment repository for OCM:
PUSH_URL="git@github.com:RedHatInsights/uhc-portal-frontend-deploy.git"

# Public key of GitHub:
PUSH_HOSTKEY="github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ=="

# Check the environment variables:
if [ -z "${PUSH_KEY}" ]; then
  echo "The Insights push key hasn't been provided."
  echo "Make sure to set the 'PUSH_KEY' environment variable."
  exit 1
fi
if [ -z "${PUSH_URL}" ]; then
  echo "The Insights push URL hasn't been provided."
  echo "Make sure to set the 'PUSH_URL' environment variable."
  exit 1
fi
if [ -z "${PUSH_HOSTKEY}" ]; then
  echo "The Insights push host key hasn't been provided."
  echo "Make sure to set the 'PUSH_HOSTKEY' environment variable."
  exit 1
fi

# The version should be the short git hash:
VERSION="$(git log --pretty=format:'%h' -n 1)"
SUBJECT="$(git log --pretty=format:'%s' -n 1)"

# Set the Go path:
export GOPATH="${PWD}/.gopath"
export PATH="${PATH}:${GOPATH}/bin"

# Create the project directory inside the Go path and copy all the files of
# the project:
PROJECT="${GOPATH}/src/gitlab.cee.redhat.com/service/uhc-portal"
mkdir -p "${PROJECT}"
rsync -ap \
  --exclude=.gopath \
  --exclude=.git \
  . "${PROJECT}"
cd "${PROJECT}"

# Save the push key:
rm --force key
echo "${PUSH_KEY}" | base64 --decode > key
chmod u=r,g=,o= key

# Save the push host key:
rm --force hostkey
echo "${PUSH_HOSTKEY}" > hostkey

# The version of `git` in the Jenkins slave is 1.18, and it doesn't support the
# `GIT_SSH_COMMAND` environment variable, it only suppors `GIT_SSH`. So we need
# to generate a script that wraps the original `ssh` command and adds the
# required options, and then put it in the `GIT_SSH` environment variable.
rm --force ssh
cat > ssh <<.
#!/bin/bash
exec /usr/bin/ssh \
-o User=git \
-o IdentityFile=${PWD}/key \
-o IdentitiesOnly=true \
-o UserKnownHostsFile=${PWD}/hostkey \
\$@
.
chmod u=rx,g=,o= ssh
export GIT_SSH="${PWD}/ssh"

# Clone the target Insights deployment repository:
rm --recursive --force target
mkdir target
git clone \
  --depth 1 \
  --single-branch \
  --branch master \
  "${PUSH_URL}" \
  target

# This function pushes the contents of the `build` directory to a specific
# branch of the Insights repository.
function push_build {
  # Get the parameters:
  local branch="$1"
  local gateway="$2"

  # Fetch the target branch:
  pushd target
    git fetch \
      --depth 1 \
      origin "${branch}"
    git branch \
      "${branch}" \
      FETCH_HEAD
    git checkout \
      "${branch}"
  popd

  # Replace all the files in the target branch with the new build:
  rsync \
    --archive \
    --delete \
    --exclude=.git \
    --exclude=58231b16fdee45a03a4ee3cf94a9f2c3 \
    build/openshift/ \
    target/

  # The `config.json` file is generated dynamically when using the development
  # environment (templates.go). We generate it here for Insights.
  # Note that this configuration doesn't contain the Keycloak parameters,
  # because authentication is managed by Insights, not by us.
  mkdir --parents target/config
  rm --recursive --force target/config/config.json
  cat >> target/config/config.json <<.
{
  "apiGateway": "${gateway}",
  "installerURL": "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/",
  "documentationURL": "https://github.com/openshift/installer/blob/master/README.md#quick-start",
  "terraformInstallURL": "https://www.terraform.io/downloads.html",
  "commandLineToolsURL": "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/"
}
.

  # Create a commit for the new build and push it:
  cat > message <<.
Update to ${VERSION}

${SUBJECT}
.
  pushd target
    git add \
      --force \
      *
    git commit \
      --all \
      --allow-empty \
      --file ../message \
      --author "UHC Team <***REMOVED***>"
    git push \
      origin \
      "${branch}:${branch}"
  popd
}

if [ "$1" == "beta" ]; then
    echo "running beta push"
    # Install dependencies:
    rm --recursive --force node_modules
    yarn install
    # Build the application for deployment to the prod-beta branch
    # of the Insights platform:
    rm --recursive --force build
    yarn build --mode=production --beta=true
    push_build "prod-beta" "https://api.stage.openshift.com"
elif [ "$1" == "stable" ]; then
    echo "running stable push"
    # Install dependencies:
    rm --recursive --force node_modules
    yarn install
    # Build the application for deployment to the prod-stable branch
    # of the Insights platform:
    rm --recursive --force build
    yarn build --mode=production
    push_build "prod-stable" "https://api.openshift.com"
else
    echo "no mode specified, doing nothing"
fi
