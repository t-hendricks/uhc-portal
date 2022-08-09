#!/bin/bash -e

# This script serves two roles:
#  1. Run locally to generate new subscriptions.json, clusters.json collections
#     from individual subscriptions/*.json, clusters/*.json responses.
#     - In this case, modifying the collections is expected, `git status` is just informative.
#     * Inconsistency between subscriptions/clusters is an error.
#  2. Run in CI to test committed data is consistent.
#     * In this case, if the collections changed it's an error — files in git were inconsistent.
#       => This is checked with `git diff` in pr_check.sh.
#     * Inconsistency between subscriptions/clusters is an error.  Checked by this script.

cd "$(dirname "$0")" # directory of this script
cd "$(git rev-parse --show-toplevel)"

CLUSTERS=mockdata/api/clusters_mgmt/v1/clusters
SUBSCRIPTIONS=mockdata/api/accounts_mgmt/v1/subscriptions

# In reality we accountsService.getSubscriptions() in UI sort order - `&orderBy=display_name+asc`
# and then clusterService.getClusters() for specific list of cluster ids, in no particular order.
# Sorting clusters by .name here is just for stability, clustersActions doesn't care.
jq --slurp '{
  kind: "ClusterList",
  page: 1,
  size: . | length,
  total: . | length,
  items: . | sort_by(.name),
}' "$CLUSTERS"/*.json >"$CLUSTERS.json"

echo "Regenerated '$CLUSTERS.json'."
git status --short "$CLUSTERS.json"

jq --slurp '{
  kind: "SubscriptionList",
  page: 1,
  size: . | length,
  total: . | length,
  items: . | sort_by(.display_name),
}' "$SUBSCRIPTIONS"/*.json >"$SUBSCRIPTIONS.json"

echo "Regenerated '$SUBSCRIPTIONS.json'."
git status --short "$SUBSCRIPTIONS.json"

echo
echo "Checking consistency between '$SUBSCRIPTIONS.json' and '$CLUSTERS.json':"
echo "# sid = subscription id, cid = cluster id, eid = external id, dn = display name."
echo "# both sides should be sorted by subscription id."

# During install, clusters-service can know external_id while account-manager still has null.
# To allow the comparison to pass, those ids were edited to contain `EXPECT-AMS-null`.
diff --report-identical-files --side-by-side --width=150 \
  --ignore-matching-lines='EXPECT-AMS-null\|null,' \
  --ignore-matching-lines='"dn":' \
  --label="from $SUBSCRIPTIONS.json" --label="from $CLUSTERS.json" \
  <(jq '.items | sort_by(.id)[] | { sid: .id, cid: .cluster_id, eid: .external_cluster_id, dn: .display_name }' "$SUBSCRIPTIONS.json") \
  <(jq '.items | sort_by(.subscription.id)[] | { sid: .subscription.id, cid: .id, eid: .external_id, dn: "N/A" }' "$CLUSTERS.json") \
  |
  (colordiff || cat)

# exit status is diff's status
if [ "${PIPESTATUS[0]}" != 0 ]; then
  echo "ERROR: $SUBSCRIPTIONS/*.json <-> $CLUSTERS/*.json inconsistent, see diff ^^^"
  exit 1
fi
