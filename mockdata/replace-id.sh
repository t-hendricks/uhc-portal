#!/bin/bash
HELP="Usage: $0 old_id new_id

Replaces a string in both file names and file content.
It's useful when doing record-real-cluster.sh several times on same cluster -
repeat this with subscription id, cluster id, external id.
"

if [ "$#" != 2 ]; then
  echo "$HELP"
  exit 1
fi

cd "$(dirname "$0")" # directory of this script
cd "$(git rev-parse --show-toplevel)"

if echo "$1" "$2" | grep '/'; then
  echo "ERROR: old_id and new_id should not contain '/'."
  exit 1
fi

if find mockdata/api | grep --color=auto --fixed-strings "$2"; then
  echo "ERROR: new_id already appears in file names ^^, should be unique."
  exit 1
fi

if grep --color=auto --recursive --fixed-strings "$2" mockdata/api; then
  echo "ERROR: new_id already appears in the data ^^, should be unique."
  exit 1
fi

# Depth-first so we'll find files in their old place before we rename their parents.
find mockdata/api -depth | while read path; do
  # Rename only within dir; parent directories will be renamed later.
  dirname="$(dirname "$path")"
  new_basename="$(echo "$(basename "$path")" | sed "s/$1/$2/")"
  new_path="$dirname/$new_basename"
  if [ -f "$path" ]; then
    sed "s/$1/$2/" "$path" >"$new_path.tmp"
    diff --color=auto --unified=0 "$path" "$new_path.tmp"
    rm "$path"
    mv --no-target-directory "$new_path.tmp" "$new_path"
    if [ "$path" != "$new_path" ]; then
      echo "Processed $path -> $new_path"
    fi
  else
    if [ "$path" != "$new_path" ]; then
      mv --no-target-directory --verbose "$path" "$new_path"
    fi
  fi
done

mockdata/regenerate-clusters.json.sh
