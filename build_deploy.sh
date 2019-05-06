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

# This script builds the UHC portal image, and pushes it to the image registry.
# In order to work it needs the following variables defined in the CI/CD
# configuration of the project:
#
# QUAY_USER - The name of the robot account used to push images to 'quay.io',
# for example 'openshift-unified-hybrid-cloud+jenkins'.
#
# QUAY_TOKEN - The token of the robot account used to push images to 'quay.io'.
#
# PUSH_URL - URL of the Insights platform git repository where the build will be
# pushed.
#
# PUSH_KEY - Base64 encoded SSH private key used to push to the Insights
# platform git repository.
#
# PUSH_HOSTKEY - Public SSH key the host where the Insights platform git
# repository lives, usually _github.com_.
#
# The machines that run this script need to have access to internet, so that the
# built images can be pushed to quay.io.

# Check the environment variables:
if [ -z "${QUAY_USER}" ]; then
  echo "The 'quay.io' push user name hasn't been provided."
  echo "Make sure to set the 'QUAY_USER' environment variable."
  exit 1
fi
if [ -z "${QUAY_TOKEN}" ]; then
  echo "The 'quay.io' push token hasn't been provided."
  echo "Make sure to set the 'QUAY_TOKEN' environment variable."
  exit 1
fi
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

# Set the directory for docker configuration:
DOCKER_CONFIG="${PWD}/.docker"

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

# Build the image:
make \
  version="${VERSION}" \
  app \
  binary \
  image

# Log in to the image registry:
mkdir -p "${DOCKER_CONFIG}"
docker login -u "${QUAY_USER}" -p "${QUAY_TOKEN}" quay.io

# Push the image:
make \
  version="${VERSION}" \
  push

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
    build/clusters/ \
    target/

  # The `config.json` file is generated dynamicall by the portal server, but that
  # isn't possible in the _cloud.redhat.com_ environment, so we need to generate
  # it here. Note that this configuration doesn't contain the Keycloak parameters,
  # because authentication is managed by the chrome, not by the application.
  mkdir --parents target/config
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

# Build the application in development mode for deployment to the beta branches
# of the Insights platform:
rm --recursive --force build
yarn build-embedded
push_build "ci-beta" "https://api.stage.openshift.com"
push_build "qa-beta" "https://api.stage.openshift.com"
#push_build "prod-beta" "https://api.openshift.com"

# Build the application in production mode for deployment to the stable branches
# of the Insights platform:
rm --recursive --force build
yarn build-embedded --mode=production
push_build "ci-stable" "https://api.stage.openshift.com"
push_build "qa-stable" "https://api.stage.openshift.com"
#push_build "prod-stable" "https://api.openshift.com"
