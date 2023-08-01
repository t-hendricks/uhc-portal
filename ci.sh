#!/bin/bash

# setNpmOrYarn
USES_NPM=false

# install dependencies
yarn install

# build
if [ $IS_PR = true ]; then
  echo "is PR!"
fi

yarn build --mode=production --env api-env=staging --output-path ./dist

# do not use dev dockerfile
#rm $APP_ROOT/Dockerfile
#rm $APP_ROOT/.dockerignore
