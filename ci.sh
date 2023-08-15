#!/bin/bash

# this script is sourced during the execution of pr_check/build_deploy


# setNpmOrYarn
USES_YARN=true

# install dependencies
yarn install

# build
if [ $IS_PR = false ]; then
  yarn lint
fi

yarn build --mode=production --env api-env=staging --output-path ./dist
