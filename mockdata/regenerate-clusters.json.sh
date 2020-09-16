#!/bin/bash -e

cd "$(dirname "$0")"  # directory of this script
cd "$(git rev-parse --show-toplevel)"

CLUSTERS=mockdata/api/clusters_mgmt/v1/clusters
SUBSCRIPTIONS=mockdata/api/accounts_mgmt/v1/subscriptions

jq --slurp '{
  kind: "ClusterList",
  page: 1,
  size: . | length,
  total: . | length,
  items: . | sort_by(.display_name),
}' "$CLUSTERS"/*.json > "$CLUSTERS.json"

echo "Regenerated '$CLUSTERS.json'."
git status --short "$CLUSTERS.json"

jq --slurp '{
  kind: "SubscriptionList",
  page: 1,
  size: . | length,
  total: . | length,
  items: . | sort_by(.display_name),
}' "$SUBSCRIPTIONS"/*.json > "$SUBSCRIPTIONS.json"

echo "Regenerated '$SUBSCRIPTIONS.json'."
git status --short "$SUBSCRIPTIONS.json"

echo
echo "Checking consistency between '$CLUSTERS.json' and '$SUBSCRIPTIONS.json':"
echo "# order is [cluster id, subscription id, external id, display name]"
echo "# both sides should be sorted by display_name."

diff --report-identical-files --side-by-side --label="from $CLUSTERS.json" --label="from $SUBSCRIPTIONS.json" \
 <(jq '.items[] | [.id, .subscription.id, .external_id, .display_name]' "$CLUSTERS.json") \
 <(jq '.items[] | [.cluster_id, .id, .external_cluster_id, .display_name]' "$SUBSCRIPTIONS.json") |
(colordiff || cat)

# exit status - only 0 if nothing changes and consistency was good
[ "${PIPESTATUS[0]}" == 0 ] && git diff --quiet -- "$CLUSTERS.json" "$SUBSCRIPTIONS.json"
