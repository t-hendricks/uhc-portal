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
# deployment repositories. It is called via git hooks that trigger Jenkins jobs
# when code is merged to the 'master', 'candidate' or ' stable' branches.
#
# See app-interface for the job definition:
#
#  https://gitlab.cee.redhat.com/service/app-interface/blob/master/resources/jenkins/uhc/job-templates.yaml
#
# The script requires the following enviroment variables:
#
# PUSH_KEY - Base64 encoded SSH private key used to push to the Insights
# platform git repository. Available in Jenkins via Vault.
#
# This script expects either "stable", "staging" or "candidate" as the first paramter, specifying which branch to deploy


# URL of the Insights deployment repository for OCM:
PUSH_URL="git@github.com:RedHatInsights/uhc-portal-frontend-deploy.git"

# Public key of GitHub:
PUSH_HOSTKEY="github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ=="

# Check the environment variables:
if [ -z "${PUSH_KEY}" ]; then
  echo "Insights push key hasn't been provided."
  echo "Make sure to set the 'PUSH_KEY' environment variable."
  exit 1
fi
if [ -z "${PUSH_URL}" ]; then
  echo "Insights push URL hasn't been provided."
  echo "Make sure to set the 'PUSH_URL' environment variable."
  exit 1
fi
if [ -z "${PUSH_HOSTKEY}" ]; then
  echo "Insights push host key hasn't been provided."
  echo "Make sure to set the 'PUSH_HOSTKEY' environment variable."
  exit 1
fi

# The version should be the short git hash:
VERSION="$(git log --pretty=format:'%h' -n 1)"
SUBJECT="$(git log --pretty=format:'%s' -n 1)"
COMMIT_DATE="$(git log --pretty=format:'%ci' -n 1)"

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
  echo "Pushing to Insights branch '${branch}'"

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
    build/openshift/ \
    target/

  # Copy the Insights deployment jenkins file to the target
  cp insights-Jenkinsfile target/58231b16fdee45a03a4ee3cf94a9f2c3

  # Populate the app.info.json file with build information
  echo "{
    \"app_name\": \"OCM\",
    \"src_hash\": \"$VERSION\",
    \"src_branch\": \"$branch\",
    \"commit_date\": \"$COMMIT_DATE\"
  }" > target/app.info.json

  # Create a commit for the new build and push it:
  cat > message <<.
Update to ${VERSION}

${SUBJECT}
.
  pushd target
    git add \
      --force \
      ./*
    git commit \
      --all \
      --allow-empty \
      --file ../message \
      --author "OCM Team <ocm-feedback@redhat.com>"
    git push \
      origin \
      "${branch}:${branch}"
  popd
}

# Install dependencies:
echo "Installing dependencies"
rm -rf node_modules
yarn install

if [ "$1" == "staging" ] || [ "$1" == "beta" ]; then
    echo "running staging push"
    echo "staging branch is available on https://qaprodauth.cloud.redhat.com/openshift"
    rm -rf build
    yarn build --mode=production --env api-env=staging
    push_build "qa-stable"

    echo "running staging (qa-beta) push"
    echo "staging branch is available on https://qaprodauth.cloud.redhat.com/beta/openshift"
    rm -rf build
    yarn build --mode=production --env api-env=staging beta="true"
    push_build "qa-beta"

    echo "running push to secondary environment - ci-beta (not supported)"
    rm -rf build
    yarn build --mode=production --env api-env=disabled beta="true"
    push_build "ci-beta"

elif [ "$1" == "candidate" ]; then
    echo "running candidate push"
    echo "Candidate branch is available on https://console.redhat.com/beta/openshift"
    rm -rf build
    yarn build --mode=production --env api-env=production beta="true"
    push_build "prod-beta"
elif [ "$1" == "stable" ]; then
    echo "running stable push"
    echo "stable branch is available on https://console.redhat.com/openshift"
    rm -rf build
    yarn build --mode=production --env api-env=production beta="false"
    push_build "prod-stable"
else
    echo "mode (first param) must be one of: staging / candidate / stable"
    exit 1
fi
