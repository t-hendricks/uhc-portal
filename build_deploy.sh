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

# This script builds and deploys the UHC portal. In order to work it
# needs the following variables defined in the CI/CD configuration of the
# project:
#
# QUAY_PUSH_USER - The name of the robot account used to push images to
# 'quay.io', for example 'openshift-unified-hybrid-cloud+jenkins'.
#
# QUAY_PUSH_TOKEN - The token of the robot account used to push images to
# 'quay.io'.
#
# QUAY_PULL_USER - The name of the robot account used inside the cluster to pull
# images from 'quay.io', for example 'openshift-unified-hybrid-cloud+sandbox'.
#
# QUAY_PULL_TOKEN - The token of the robot account used inside the cluster to
# pull images from 'quay.io'.
#
# OC_LOGIN_URL, OC_LOGIN_USER, OC_LOGIN_PASSWORD and OC_LOGIN_TOKEN - The
# details needed to connect to the cluster where the portal should be deployed.
#
# GATEWAY_DOMAIN - The DNS domain where the API gateway is deployed.
#
# PORTAL_DOMAIN - The DNS domain of the application, for example
# 'cloud.openshift.com'.
#
# KEYCLOAK_URL, KEYCLOAK_REALM and KEYCLOAK_CLIENT_ID - The details of the
# Keycloak instance that the application will use for authentication.
#
# The machines that run this script need to have access to internet, so that the
# built images can be pushed to quay.io.

# Make sure that the build identifier has been provided, and calculate a build
# timestamp:
if [ -z "${BUILD_ID}" ]; then
  echo "The build identifier hasn't been provided."
  echo "Make sure to set the 'BUILD_ID' environment variable."
  exit 1
fi
BUILD_TS="$(date --utc --iso-8601=seconds)"

# The version should be 'latest' for commits, and the tag name for tags:
if [ -z "${VERSION}" ]; then
  if [ "${TRIGGER}" = "tag" ]; then
    VERSION="$(git describe)"
  else
    VERSION="latest"
  fi
fi

# Set the directory for docker configuration:
DOCKER_CONFIG="${PWD}/.docker"

# Build the image:
make \
  build_id="${BUILD_ID}" \
  build_ts="${BUILD_TS}" \
  version="${VERSION}" \
  app \
  image

# Log in to the image registry:
if [ -z "${QUAY_PUSH_USER}" ]; then
  echo "The 'quay.io' push user name hasn't been provided."
  echo "Make sure to set the 'QUAY_PUSH_USER' environment variable."
  exit 1
fi
if [ -z "${QUAY_PUSH_TOKEN}" ]; then
  echo "The 'quay.io' push token hasn't been provided."
  echo "Make sure to set the 'QUAY_PUSH_TOKEN' environment variable."
  exit 1
fi
mkdir -p "${DOCKER_CONFIG}"
docker login -u "${QUAY_PUSH_USER}" -p "${QUAY_PUSH_TOKEN}" quay.io
trap "docker logout" EXIT

# Push the image:
make \
  build_id="${BUILD_ID}" \
  build_ts="${BUILD_TS}" \
  version="${VERSION}" \
  push

# Log in to the cluster:
if [ -z "${OC_LOGIN_URL}" ]; then
  echo "The cluster URL hasn't been provided."
  echo "Make sure to set the 'OC_LOGIN_URL' environment variable."
  exit 1
fi
if [ -z "${OC_LOGIN_USER}" ]; then
  echo "The cluster user hasn't been provided."
  echo "Make sure to set the 'OC_LOGIN_USER' environment variable."
  exit 1
fi
if [ -z "${OC_LOGIN_PASSWORD}" ]; then
  echo "The cluster password hasn't been provided."
  echo "Make sure to set the 'OC_LOGIN_PASSWORD' environment variable."
  exit 1
fi
if [ -z "${OC_LOGIN_TOKEN}" ]; then
  echo "The cluster token hasn't been provided."
  echo "Make sure to set the 'OC_LOGIN_TOKEN' environment variable."
  exit 1
fi
if [ "${OC_LOGIN_USER}" != "none" -a "${OC_LOGIN_PASSWORD}" != "none" ]; then
  oc login \
    --username "${OC_LOGIN_USER}" \
    --password "${OC_LOGIN_PASSWORD}" \
    --insecure-skip-tls-verify \
    "${OC_LOGIN_URL}"
elif [ "${OC_LOGIN_TOKEN}" != "none" ]; then
  oc login \
    --token "${OC_LOGIN_TOKEN}" \
    --insecure-skip-tls-verify \
    "${OC_LOGIN_URL}"
else
  echo "Cluster authentication details haven't been provided."
  echo "Make sure to set the 'OC_LOGIN_USER' and 'OC_LOGIN_PASSWORD' environment variables."
  echo "Alternatively, if you want to use a token, set the 'OC_LOGIN_TOKEN' environment variable."
  exit 1
fi
trap "oc logout" EXIT

# Deploy the application:
if [ -z "${GATEWAY_DOMAIN}" ]; then
  echo "The DNS domain of the gateway hasn't been provided."
  echo "Make sure to set the 'GATEWAY_DOMAIN' environment variable."
  exit 1
fi
if [ -z "${PORTAL_DOMAIN}" ]; then
  echo "The DNS domain of the portal hasn't been provided."
  echo "Make sure to set the 'PORTAL_DOMAIN' environment variable."
  exit 1
fi
if [ -z "${KEYCLOAK_URL}" ]; then
  echo "The Keycloak URL hasn't been provided."
  echo "Make sure to set the 'KEYCLOAK_URL' environment variable."
  exit 1
fi
if [ -z "${KEYCLOAK_REALM}" ]; then
  echo "The Keycloak realm hasn't been provided."
  echo "Make sure to set the 'KEYCLOAK_REALM' environment variable."
  exit 1
fi
if [ -z "${KEYCLOAK_CLIENT_ID}" ]; then
  echo "The Keycloak client identifier hasn't been provided."
  echo "Make sure to set the 'KEYCLOAK_CLIENT_ID' environment variable."
  exit 1
fi
make \
  build_id="${BUILD_ID}" \
  build_ts="${BUILD_TS}" \
  gateway_domain="${GATEWAY_DOMAIN}" \
  image_pull_policy="Always" \
  keycloak_client_id="${KEYCLOAK_CLIENT_ID}" \
  keycloak_realm="${KEYCLOAK_REALM}" \
  keycloak_url="${KEYCLOAK_URL}" \
  portal_domain="${PORTAL_DOMAIN}" \
  version="${VERSION}" \
  deploy

# Create the docker JSON configuration containing the quay.io pull token:
if [ -z "${QUAY_PULL_USER}" ]; then
  echo "The 'quay.io' pull user name hasn't been provided."
  echo "Make sure to set the 'QUAY_PULL_USER' environment variable."
  exit 1
fi
if [ -z "${QUAY_PULL_TOKEN}" ]; then
  echo "The 'quay.io' pull token hasn't been provided."
  echo "Make sure to set the 'QUAY_PULL_TOKEN' environment variable."
  exit 1
fi
QUAY_PULL_AUTH="$(echo -n "${QUAY_PULL_USER}:${QUAY_PULL_TOKEN}" | base64 --wrap 0)"
QUAY_PULL_JSON="{
  \"auths\": {
    \"quay.io\": {
      \"auth\": \"${QUAY_PULL_AUTH}\",
      \"email\": \"\"
    }
  }
}"

# Create the additional objects that are needed to use the clusters service in
# our environment:
oc process \
  --filename="build_deploy.yml" \
  --local="true" \
  --param="PORTAL_DOMAIN=${PORTAL_DOMAIN}" \
  --param="QUAY_PULL_JSON=$(echo -n "${QUAY_PULL_JSON}" | base64 --wrap 0)" \
  > build_deploy.json
trap "rm build_deploy.json" EXIT
oc apply \
  --filename="build_deploy.json"

# Add the quay.io pull secret to the service accounts:
oc secrets link \
  default \
  quay-token \
  --for=pull
