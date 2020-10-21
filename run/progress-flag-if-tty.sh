#!/bin/bash
# Two situations where we prefer --no-progress:
#  1. Under CI. It's only informative while build is running, takes way too much
#     of the resulting log (>3MB), and makes the full log painfully slow to load.
#  2. Under 'concurrently' - bad experience, scrolls rather than update in-place.
#     https://github.com/kimmobrunfeldt/concurrently/issues/85

# Is stdin a terminal?  This should catch both cases.
if [ -t 0 ]; then
  echo --progress
else
  echo --no-progress
fi
