#!/bin/bash

# setNpmOrYarn
USES_NPM=false

# install dependencies
npm ci

# build
if [ $IS_PR = true ]; then
  echo "is PR!"
fi
yarn build --mode=production --env api-env=staging

# do not use dev dockerfile
#rm $APP_ROOT/Dockerfile
#rm $APP_ROOT/.dockerignore
