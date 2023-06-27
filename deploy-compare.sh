#!/bin/bash -e

usageMsg="Usage: deploy-compare [--after=<YYYY-MM-DD>] [--before=<YYYY-MM-DD>] --jira-token=<44 char token string>
--after will default to 1 month ago if not specified.
To get a jira token goto your profile in Jira and select 'Personal Access Tokens' and 'Create token'"

if [ $# -eq 0 ]; then
    echo "Please provide the following parameters:"
    echo "$usageMsg"
    exit 1
fi

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
      echo "$usageMsg"
      exit 1
      ;;
  esac
  shift
done

if [ -z "$after" ] ; then
    after=$(date -v-1m +%Y-%m-%d)
    echo "Defaulting 'after' to '$after'"
fi

echo "Creating live branches"
./deploy_info.mjs --set-git-branches

# write out remotes/origin/master git "Merge branch..." commits (commitHash, commitDate, commitSummary) 'after' and/or 'before' date specified
git log --grep='^Merge branch.*into '\''master'\''' --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s" --date=short live_master | awk '{ printf "%s,%s,%s\n", substr($0, 1, 9), substr($0, 11, 10), substr($0, 22) }' > masterBranch.txt

# write out remotes/origin/candidate git commits (commitHash, commitDate, commitSummary, commitDescription) 'after' and/or 'before' date specified
git log --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s%n%B" --date=short live_candidate > candidateBranch.txt

./run/deploy-report.sh --jira-token="$jira_token" < masterBranch.txt