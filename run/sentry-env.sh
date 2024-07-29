#!/bin/bash -e


# this script defines env' vars used by Sentry for building, injecting and publishing sourcemaps.
#
# it should be sourced rather than executed, e.g. within the shell:
# . run/sentry-env.sh && yarn build:saas --env api-env=staging
#
# @see package.json#scripts.sentry:sourcemaps-release:saas
# @see https://glitchtip.devshift.net/ocm/issues?project=64 (staging/stable)
# @see https://glitchtip.devshift.net/ocm/issues?project=65 (production/stable)


# don't set up sentry-env on preview builds;
# sourcemaps are only deployed to stable environments.
if [[ ${BETA} == 'true' ]]; then
  return 0
fi


VERSION="${VERSION:-$(git rev-parse --short HEAD)}"

SENTRY_STAGE_PROJECT="ocm-uhc-portal-stage"
SENTRY_PROD_PROJECT="ocm-uhc-portal"
SENTRY_STAGE_VERSION="$SENTRY_STAGE_PROJECT-$VERSION"
SENTRY_PROD_VERSION="$SENTRY_PROD_PROJECT-$VERSION"

if [[ "$*" =~ '--production' ]]; then
  SENTRY_VERSION_VALUE="$SENTRY_PROD_VERSION"
  SENTRY_PROJECT_VALUE="$SENTRY_PROD_PROJECT"
else
  SENTRY_VERSION_VALUE="$SENTRY_STAGE_VERSION"
  SENTRY_PROJECT_VALUE="$SENTRY_STAGE_PROJECT"
fi

export SENTRY_VERSION="$SENTRY_VERSION_VALUE"
export SENTRY_PROJECT="$SENTRY_PROJECT_VALUE"

echo "
Sentry environment:
  SENTRY_PROJECT=$SENTRY_PROJECT
  SENTRY_VERSION=$SENTRY_VERSION
"

