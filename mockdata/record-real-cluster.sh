#!/bin/bash
if [ $# != 1 ]; then
  cat >&2 <<'END-OF-USAGE'
Usage: mockdata/record-real-cluster.sh SUBSCRIPTION-ID

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

# try_request LOG_PREFIX PATH [EXTRA ocm FLAGS]
#   Returns 0 only if request succeeded.
function try_request {
  log_prefix="$1"
  path="$2"
  shift 2
  mkdir --parents mockdata/"$(dirname "$path")"
  echo "${log_prefix}ocm get $path $*"
  # In case of error, leaving an empty file would result in mockserver returning
  # 200 OK with empty body. Better delete it so UI gets 404.
  if ! ocm get "$path" "$@" > mockdata/"$path".json; then
    rm mockdata/"$path".json
    return 1
  fi
}

# request LOG_PREFIX PATH [EXTRA ocm FLAGS]
#   Succeeds even if request failed; test presence
function request {
  try_request "$@" || return 0
}

echo ENV: $(ocm config get url)
echo WHOAMI: $(ocm whoami | jq '.username, .organization.href')
echo

subscription_id="$1"
subscription_href="/api/accounts_mgmt/v1/subscriptions/$subscription_id"

request "" "$subscription_href" --parameter=fetchAccounts=true --parameter=fetchCpuAndSocket=true --parameter=fetchCapabilities=true
request "" "$subscription_href/notification_contacts" --parameter=size=-1
request "" "$subscription_href/support_cases" --parameter=size=1000  # SDB-2817: size=-1 here is expensive and may return errors
request "" "$subscription_href/ondemand_metrics" --parameter=size=-1
request "" "$subscription_href/role_bindings" --parameter=size=-1

uuid="$(jq .external_cluster_id "mockdata/$subscription_href.json" --raw-output)"
request "" "/api/service_logs/v1/clusters/$uuid/cluster_logs" --parameter=size=20 --parameter='orderBy=timestamp desc'

# TODO in dev this is requested as /api/aggregator/... ?
request "" "/api/insights-results-aggregator/v1/clusters/$uuid/report" --parameter=osd_eligible=true
request "" "/api/insights-results-aggregator/v2/clusters/$uuid/report" --parameter=osd_eligible=true

# For some cluster types e.g. OCP-AssistedInstall, this might not be a clusters_mgmt ID, but we can try.
cluster_id="$(jq .cluster_id "mockdata/$subscription_href".json --raw-output)"
cluster_href="/api/clusters_mgmt/v1/clusters/$cluster_id"

if ! try_request "" "$cluster_href"; then
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
      if [[ "$href" =~ cloud_providers ]]; then
        echo "  # ocm get $href  # handled below"
        continue
      fi
      # Linked hrefs are a mix of collections (e.g. /api/clusters_mgmt/v1/clusters/.../machine_pools)
      # and single objects (e.g. /api/clusters_mgmt/v1/machine_types/r5.xlarge).
      # size=-1 parameter makes no sense for the latter, but backend happily ignores it (as of May 2022).
      request "  " "$href" --parameter=size=-1
    done

  request "" "$cluster_href/status"
  request "" "$cluster_href/logs/install"
  request "" "$cluster_href/logs/uninstall"
  request "" "$cluster_href/addon_inquiries" --parameter=size=-1
  request "" "$cluster_href/gate_agreements" --parameter=size=-1
  request "" "$cluster_href/limited_support_reasons" --parameter=size=-1

  request "" "$cluster_href/upgrade_policies" --parameter="search=upgrade_type='OSD'" --parameter=size=-1
  cat "mockdata/$cluster_href/upgrade_policies.json" |
    jq '.items[].href' --raw-output |
    while read -r policy_href; do
      request "  " "$policy_href/state"
      # Not currently queried by UI, would duplicate upgrade_policies.json and be a chore to maintain.
      #request "  " "$policy_href"
    done
fi

echo
echo "# Trying to get CLUSTER's account & org (may need UHCSupport role):"
account_href=$(jq .creator.href "mockdata/$subscription_href.json" --raw-output)
if try_request "  " "$account_href"; then
  cp -v "mockdata/$account_href.json" "mockdata/api/accounts_mgmt/v1/current_account.json"
else
  echo "# Falling back to YOUR account & org:"
  request "  " "/api/accounts_mgmt/v1/current_account"
fi

org_href=$(jq .organization.href "mockdata/api/accounts_mgmt/v1/current_account.json" --raw-output)
request "    " "$org_href" --parameter=fetchCapabilities=true
request "    " "$org_href/quota_cost" --parameter=fetchRelatedResources=true --parameter=size=-1

echo
echo "# Global data"
request "" "/api/clusters_mgmt/v1/version_gates" --parameter=size=-1

request "" "/api/clusters_mgmt/v1/cloud_providers" --parameter=size=-1 --parameter=fetchRegions=true
# Not fetching sub-resources (specific provider / regions collection / specific region) —
# not currently queried by UI, would duplicate cloud_providers.json and be a chore to maintain.

request "" "/api/clusters_mgmt/v1/limited_support_reason_templates" --parameter=size=-1

mockdata/regenerate-clusters.json.sh || true

git status --short --untracked-files=all mockdata/

echo
echo "NOTE: Overwrote current_account.json to let you see fetched org & quota."
echo "      Normally you DO NOT want to commit it."
