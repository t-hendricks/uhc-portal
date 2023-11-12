#!/bin/bash
# TODO Uses various GNU flags, rewrite parts in JS?

# Usage:
#   run/file-mrs.sh [GIT LOG FLAGS] [--] FILE...
# List MRs to master + their cherry-picks that touched given file(s).
# When working on a release, set EXTRA_REFS env var to your WIP branch name to see your picks.

DEV_REF=${DEV_REF:-live_consoledev_master}
PROMOTED_REF=${PROMOTED_REF:-live_candidate}
EXTRA_REFS=${EXTRA_REFS-}

# Hide MRs predating last merge point — no longer interesting for promotion,
# and might confusingly show on only one side.
BASE=${BASE:-"$(git merge-base "$DEV_REF" "$PROMOTED_REF")"}

#                -o---o  -o  -o  -o
#           \          \   \   \   \
# master  ---P---BASE---D---E---F---G  <--DEV_REF  (--first-parent)
#                    \
# candidate ----------*-------*        <--PROMOTED_REF
#                      \     / \
# candidate-last-week   e---g   \
# candidate-your-WIP             d--   <--EXTRA_REFS
# 
# Shall output:
#   A: ... C: ...              master  DDDD  Merge branch 'D' into 'master' ...
#   A: "   C: now  candidate-your-WIP  dddd  Merge branch 'D' into 'master' ...⏎ (cherry picked from commit DDDD)
#
#   A: ... C: ...              master  EEEE  Merge branch 'E' into 'master' ...
#   A: "   C: week ago      candidate  eeee  Merge branch 'E' into 'master' ...⏎ (cherry picked from commit EEEE)
#
#   A: ... C: ...              master  FFFF  Merge branch 'F' into 'master' ...
#
#   A: ... C: ...              master  GGGG  Merge branch 'G' into 'master' ...
#   A: "   C: week ago      candidate  gggg  Merge branch 'G' into 'master' ...⏎ (cherry picked from commit GGGG)


# Author date %ad first because it survives cherry-picking so good for grouping.
# %S identifies "source" — from which commit it was reached e.g. master vs candidate.
# %w(0,2,2) indents following lines of message by 2 spaces.
FORMAT=${FORMAT:-'%C(dim)A: %ad C: %cs %C(auto) %>(22,mtrunc)%S %h %C(dim)%s⏎ %C(reset)%w(0,2,2)%b%C(auto)%d'}

{
  # On master, --first-parent attributes diffs to the merge commit that landed the MR.
  # ("D"-"F" merges in diagram above, rather than individual "o" commits)
  git --no-pager log "^$BASE" "$DEV_REF" --first-parent \
      --color=always --date=iso-strict --pretty="$FORMAT" -z "$@"
  # On candidate & stable, cherry-picked master MRs become single-parent commits.
  # Do NOT want --first-parent as each merge to candidate deploys multiple MRs.
  # ("e", "g", "d" picks in diagram above, rather than "*" merges)
  #
  # Ref order matters: When working to a branch not yet merged into candidate,
  # cherry-picks already promoted in the past are reachable from both
  # PROMOTED_REF and your EXTRA_REFS, but you want these to show as PROMOTED_REF.
  # %S shows *first* source from which the commit is reachable.
  git --no-pager log -z "^$BASE" "$PROMOTED_REF" $EXTRA_REFS \
      --color=always --date=iso-strict --pretty="$FORMAT" -z "$@"
} |
# Fold multi-line commit messages into single line. Optional with log -z but easier to read?
perl -g -p -e 's/\n/⏎ /g' |
run/compress-git-log.mjs |
run/linkify.mjs |
# Group by Author date "A: 2023-01-27T19:59:09+00:00".
sort --zero-terminated --reverse --key=2,2 --stable |
uniq --zero-terminated --check-chars=28 --group |
tr '\0' '\n'
