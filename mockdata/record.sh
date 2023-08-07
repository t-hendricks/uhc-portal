#!/bin/bash
if [ $# == 0 ]; then
  cat >&2 <<'END-OF-USAGE'
Usage: mockdata/record.sh /api/FOO/BAR [ocm flags]

Makes a single `ocm get` API call, saving results to matching mockdata/ file.
Happily overwrites any existing file!  Use git to undo :-P

ocm flags like --parameter MUST come after the API path.
Returns 0 only if request succeeded.
END-OF-USAGE
  exit 2
fi

# https://disconnected.systems/blog/another-bash-strict-mode/
set -u -o pipefail
trap 's=$?; echo; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR

cd "$(dirname "$0")"  # directory of this script
cd "$(git rev-parse --show-toplevel)"

path="$1"
shift 1
mkdir --parents mockdata/"$(dirname "$path")"
# LOG_PREFIX env var allows parent scripts like record-real-cluster.sh to group requests.
echo "${LOG_PREFIX-}ocm get $path $*"
# In case of error, leaving an empty file would result in mockserver returning
# 200 OK with empty body. Better delete it so UI gets 404.
if ! ocm get "$path" "$@" > mockdata/"$path".json; then
  rm mockdata/"$path".json
  exit 1
fi
