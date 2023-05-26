#!/bin/bash -e

# deploy-compare --after="2023-05-17" --jira-token="OTU4.......2dTrk" 

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
      echo "Usage: deploy-compare --after=\"2023-01-17\" --before=\"2023-04-17\" --jira-token=\"<44 char token string>\""
      exit 1
      ;;
  esac
  shift
done

# write out remotes/origin/master git "Merge branch..." commits (commitHash, commitDate, commitSummary) 'after' and/or 'before' date specified
git log --grep='^Merge branch.*into '\''master'\''' --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s" --date=short remotes/origin/master | awk '{ printf "%s,%s,%s\n", substr($0, 1, 9), substr($0, 11, 10), substr($0, 22) }' > masterBranch.txt

# write out remotes/origin/candidate git commits (commitHash, commitDate, commitSummary, commitDescription) 'after' and/or 'before' date specified
git log --after="$after" ${before:+--before="\"$before\""} --pretty=format:"%h %cd %s%n%B" --date=short remotes/origin/candidate > candidateBranch.txt

./run/deploy-report.sh --jira-token="$jira_token" < masterBranch.txt