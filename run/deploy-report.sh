#!/bin/bash -e
shopt -s nocasematch

# Declare an array to store the matched jiraKeys
declare -a jiraKeys
# Declare arrays to store found, notFoundInReview, notFoundReadyToPromote commits
# found/notFound meaning if remotes/origin/master's commit message string was found/not found in remotes/origin/candidate log file
declare -a found
# associated jira tickets not closed, still in 'Review' most likely
declare -a notFoundNotClosed
# master commits ready to promote to remotes/origin/candidate
declare -a notFoundReadyToPromote

jiratoken="${1#--jira-token=}"

# Read each line from stdin (piped CSV data) and convert it to JSON
while IFS=',' read -r commitHash commitDate commitMessage; do
  echo "------------------------------------------------"
  echo "|           remotes/origin/master              |"
  echo "|  commitHash  |  commitDate  |  commitMessage |"
  echo "------------------------------------------------"
  masterLogLine="$commitHash $commitDate $commitMessage"
  echo "$masterLogLine"

  if [[ $(grep -cF "$commitMessage" "./candidateBranch.txt") -gt 0 ]]; then
    echo "--> FOUND string \"$commitMessage\" in remotes/origin/candidate"
    found+=("$masterLogLine")
    continue
  else
    echo "DID NOT FIND string \"$commitMessage\" in remotes/origin/candidate"

    # Pattern matching to extract jiraKeys
    regex="(HAC[- ]?[0-9]{4})"

    # Find and store all matching jiraKeys
    while [[ $commitMessage =~ $regex ]]; do
      matched="${BASH_REMATCH[1]}"
      # Check if the substring already exists in the array
      if [[ ! " ${jiraKeys[*]} " =~ " $matched " ]]; then
        jiraKeys+=("$matched")
      fi
      commitMessage="${commitMessage#*$matched}"
    done

    # Check if jiraKeys array is empty
    if [ "${#jiraKeys[@]}" -eq 0 ]; then
      notFoundReadyToPromote+=("  $masterLogLine")
    else
      allJirasClosed=true
      # Iterate over the jiraKeys and look them up
      for jiraKey in "${jiraKeys[@]}"; do
        jiraKeyNumber=${jiraKey//[!0-9]}
        if [[ "$jiraKey" == *"hac"* ]]; then
          jiraKey="HAC-$jiraKeyNumber"
          echo "  JIRA info"
          printf "    key: %s\n" "$jiraKey"

          response=$(curl -s -X GET -H "Authorization: Bearer $jiratoken" -H "Content-Type: application/json" "https://issues.redhat.com/rest/api/2/issue/$jiraKey?fields=key,summary,resolutiondate,status")

          summary=$(echo "$response" | jq -r '.fields.summary')
          printf "    summary: %s\n" "$summary"

          status=$(echo "$response" | jq -r '.fields.status.name')
          printf "    status: %s\n" "$status"

          resolutiondate=$(echo "$response" | jq -r '.fields.resolutiondate')
          printf "    resolutiondate: %s\n" "$resolutiondate"

          if [ "$status" != "Closed" ]; then
            allJirasClosed=false
          fi
        fi
      done
      if [ "$allJirasClosed" = true ]; then
        notFoundReadyToPromote+=("C $masterLogLine")
      else
        notFoundNotClosed+=("$masterLogLine")
      fi
    fi 
    jiraKeys=()
  fi

  : '
  echo "  Candidate branch"
  echo "    commit msg: $commitMessage"
  if [[ $(grep -c "$commitHash" "./candidateBranch.txt") -gt 0 ]]; then
    echo "--> commit hash ${commitHash} found in remotes/origin/candidate"
  else
    echo "    commit hash ${commitHash} not found in remotes/origin/candidate"
  fi
  '
done

echo " "
echo " "

echo "Commits ready to promote to candidate"
echo "  master commit messages not found in candidate"
echo "  where 'C' = ...and all associated jira tickets of the commit are Closed"
echo " "
for logLine in "${notFoundReadyToPromote[@]}"; do
  echo "$logLine"
done

echo " "

echo "Master commit messages not found in candidate, but not all associated jira tickets are Closed"
echo " "
for logLine in "${notFoundNotClosed[@]}"; do
  echo "$logLine"
done

echo " "

echo "Master commit messages found in candidate"
echo " "
for logLine in "${found[@]}"; do
  echo "$logLine"
done

shopt -u nocasematch