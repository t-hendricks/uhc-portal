#!/bin/bash
if [ $# != 1 ]; then
  cat >&2 <<'END-OF-USAGE'
Usage: mockdata/record-real-cluster.sh CLUSTER-ID

Fetches cluster info from API into mockdata/ files.
Happily overwrites any existing file!  Use git to undo :-P

The set of paths requested is likely to get outdated with time.
Please open in UI afterwards, look for 404 errors, and update this script.
END-OF-USAGE
  exit 2
fi

# https://disconnected.systems/blog/another-bash-strict-mode/
set -u -o pipefail
trap 's=$?; echo; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR

cd "$(dirname "$0")"  # directory of this script
cd "$(git rev-parse --show-toplevel)"

cluster_id="$1"
cluster_href="/api/clusters_mgmt/v1/clusters/$cluster_id"

# request LOG_PREFIX PATH [EXTRA ocm FLAGS]
function request {
  log_prefix="$1"
  path="$2"
  shift 2
  mkdir --parents mockdata/"$(dirname "$path")"
  echo "${log_prefix}ocm get $path $*"
  # In case of error, leaving an empty file would result in mockserver returning
  # 200 OK with empty body. Better delete it so UI gets 404.
  ocm get "$path" "$@" > mockdata/"$path".json || rm mockdata/"$path".json

  #echo "${log_prefix}  Found links:"
  #jq ".. | select(try .kind | test(\".*Link\")).href | \"${log_prefix}  - \" + ." mockdata/"$path".json --raw-output
}

request "" "$cluster_href"
if [ ! -f "mockdata/$cluster_href.json" ]; then
  # Don't abort the whole script - partial capture is useful when backend is misbehaving -
  # but skip the requests we can't make without the cluster data.
  echo '  ^^ FAILED getting cluster json, skipping crawl of links :-['
  echo
else
  # Crawl all FooLink, depth 1.
  # TODO: recursive with memoization?  Time to rewrite in JS / Python?
  cat "mockdata/$cluster_href.json" |
    jq '.. | select(try .kind | test(".*Link")).href' --raw-output |
    sort --unique |
    while read -r href; do
      request "  " "$href"
    done

  request "" "$cluster_href/status"
  request "" "$cluster_href/logs/install"
  request "" "$cluster_href/logs/uninstall"
  request "" "$cluster_href/addon_inquiries"

  request "" "$cluster_href/upgrade_policies" --parameter="search=upgrade_type='OSD'"
  cat "mockdata/$cluster_href/upgrade_policies.json" |
    jq '.items[].href' --raw-output |
    while read -r policy_href; do
      request "  " "$policy_href/state"
      # Not currently queried by UI, would duplicate upgrade_policies.json and be a chore to maintain.
      #request "  " "$policy_href"
    done

  subscription_href="$(jq .subscription.href "mockdata/$cluster_href".json --raw-output)"
  request "" "$subscription_href" --parameter=fetchAccounts=true --parameter=fetchCpuAndSocket=true --parameter=fetchCapabilities=true
  request "" "$subscription_href/notification_contacts"
  request "" "$subscription_href/support_cases"
  request "" "$subscription_href/ondemand_metrics"
fi

request "" "/api/accounts_mgmt/v1/current_account"

org_href=$(jq .organization.href  "mockdata/api/accounts_mgmt/v1/current_account".json --raw-output)
request "" "$org_href" --parameter=fetchCapabilities=true
request "" "$org_href/quota_cost" --parameter=fetchRelatedResources=true

# Overwrite with more details.
request "" "/api/clusters_mgmt/v1/cloud_providers" --parameter=size=-1 --parameter=fetchRegions=true

# TODO in dev this is requested as /api/aggregator/... ?
request "" "/api/insights-results-aggregator/v1/clusters/$cluster_id/report" --parameter=osd_eligible=true

mockdata/regenerate-clusters.json.sh || true

git status --short --untracked-files=all mockdata/

echo
echo "NOTE: Overwrote current_account.json to let you see fetched org & quota."
echo "      Normally you DO NOT want to commit it."
