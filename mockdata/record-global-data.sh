#!/bin/bash
if [ $# != 0 ]; then
  cat >&2 <<'END-OF-USAGE'
Usage: [env OCM_ACCOUNT_ID=...] mockdata/record-global-data.sh

Fetches account & global info from API into mockdata/ files.
Happily overwrites any existing file!  Use git to undo :-P

- If OCM_ACCOUNT_ID env var is set, try fetching that into `current_account.json`
  to reproduce that account's view (may fail without UHCSupport role).
- Otherwise, uses current account.

The set of paths requested is likely to get outdated with time.
Please open in UI afterwards, look for 404 errors, and update these record-*.sh scripts.
END-OF-USAGE
  exit 2
fi

# https://disconnected.systems/blog/another-bash-strict-mode/
set -u -o pipefail
trap 's=$?; echo; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR

cd "$(dirname "$0")"  # directory of this script
cd "$(git rev-parse --show-toplevel)"

# For most resources, we want to proceed even if request failed.
function record {
  mockdata/record.sh "$@" || return 0
}

if [ -n "${OCM_ACCOUNT_ID-}" ]; then
  account_href="/api/accounts_mgmt/v1/accounts/${OCM_ACCOUNT_ID}"
  mockdata/record.sh "$account_href" || exit 1
  cp -v "mockdata/$account_href.json" "mockdata/api/accounts_mgmt/v1/current_account.json"
else
  record "/api/accounts_mgmt/v1/current_account"
fi

echo "# Org-specific data"
org_href=$(jq .organization.href "mockdata/api/accounts_mgmt/v1/current_account.json" --raw-output)
record "$org_href" --parameter=fetchCapabilities=true
LOG_PREFIX+="  " record "$org_href/quota_cost" --parameter=fetchRelatedResources=true --parameter=size=-1

# In ROSA wizard, additionally filtered by "aws.account_id" but here grab everything.
record "/api/clusters_mgmt/v1/oidc_configs" --parameter=size=-1

echo
echo "# Global data"
record "/api/clusters_mgmt/v1/version_gates" --parameter=size=-1

# In ROSA wizard, versions are additionally filtered by "AND rosa_enabled='t'", can't reflect that here.
record "/api/clusters_mgmt/v1/versions" --parameter=search="enabled='t' AND channel_group='stable'" --parameter=order="end_of_life_timestamp desc" --parameter=size=-1

record "/api/clusters_mgmt/v1/cloud_providers" --parameter=size=-1 --parameter=fetchRegions=true
# Not fetching sub-resources (specific provider / regions collection / specific region) —
# not currently queried by UI, would duplicate cloud_providers.json and be a chore to maintain.

record "/api/clusters_mgmt/v1/limited_support_reason_templates" --parameter=size=-1

echo
git status --short --untracked-files=all mockdata/

echo
echo "NOTE: Overwrote current_account.json to let you see fetched org & quota."
echo "      Normally you DO NOT want to commit it."
