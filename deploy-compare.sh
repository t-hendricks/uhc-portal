#!/bin/bash -e

# deploy-compare --after="2023-05-17" --jira-token="OTU4.......2dTrk" 

usageMsg="Usage: deploy-compare [--after=\"YYYY-MM-DD\"] [--before=\"YYYY-MM-DD\"] --jira-token=\"<44 char token string>\"\n'--after' will default to 1 month ago if not specified.";

if [ $# -eq 0 ]; then
    echo "Please provide the following parameters:"
    echo -e "$usageMsg"
    exit 1
fi

git fetch

# Parse command-line options
while [[ $# -gt 0 ]]; do
  case "$1" in
    --after=*)
      after="${1#*=}"
      ;;
     --before=*)
      before="${1#*=}"
      ;;
    --jira-token=*)
      jira_token="${1#*=}"
      ;;
    *)
      echo "Unknown option: $1"
      echo -e "$usageMsg"
      exit 1
      ;;
  esac
  shift
done

if [ -z "$after" ] ; then
    after=$(date -v-1m +%Y-%m-%d)
    echo "Defaulting 'after' to '$after'"
fi

# write out remotes/origin/master git "Merge branch..." commits (commitHash, commitDate, commitSummary) 'after' and/or 'before' date specified
git log --grep='^Merge branch.*into '\''master'\''' --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s" --date=short live_master | awk '{ printf "%s,%s,%s\n", substr($0, 1, 9), substr($0, 11, 10), substr($0, 22) }' > masterBranch.txt

# write out remotes/origin/candidate git commits (commitHash, commitDate, commitSummary, commitDescription) 'after' and/or 'before' date specified
git log --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s%n%B" --date=short live_candidate > candidateBranch.txt

./run/deploy-report.sh --jira-token="$jira_token" < masterBranch.txt