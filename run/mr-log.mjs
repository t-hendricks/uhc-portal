#!/usr/bin/env node
/* eslint-disable no-console */

import { $ } from 'zx';

import { getJiraStatuses, linkify, terminalLink } from './linkify.mjs';

const HELP = `USAGE: run/mr-log.mjs [git log FLAGS] [--] PATH...

List MRs to master + their cherry-picks status.
Works with most 'git log' flags for filtering history!  Most useful modes (can be combined):

    # MRs that touched given path(s):  '--' optional, needed when   path got deleted.
    run/mr-log.mjs -- src/common/validators.ts

    # MRs that touched code lines matching regexp:
    run/mr-log.mjs -G 'validate[A-Za-z]+ARN'

    # MRs whose merge commit message matches regexp: (covers branch name, [JIRA] MR title)
    run/mr-log.mjs -i -E --grep '!4567|role.arn'

When working on a release, set EXTRA_REF env var to your WIP branch name to see your picks.

--------------*----------  <--stable (STABLE_REF)
             /
            /        ,f--  <--candidate-your-WIP (EXTRA_REF)
            | ,e.   /      <--candidate-last-week
    ,-p-.   |/   : /
---------*--*-----*        <--candidate (CANDIDATE_REF)
           /
--P----BASE---D---E---F--  <--master --first-parent (DEV_REF)
 /           /   /   /
       -o---o  -o  -o

would output:
  A: ... C: ...              master  FFFF  Merge branch 'F' into 'master' ...
  A: "   C: now  candidate-your-WIP  ffff  Merge branch 'F' into 'master' ...⏎ (cherry picked from commit FFFF)

  A: ... C: ...              master  EEEE  Merge branch 'E' into 'master' ...
  A: "   C: week ago      candidate  eeee  Merge branch 'E' into 'master' ...⏎ (cherry picked from commit EEEE)

  A: ... C: ...              master  DDDD  Merge branch 'D' into 'master' ...

  A: "   C: month ago        stable  pppp  Merge branch 'P' into 'master' ...⏎ (cherry picked from commit PPPP)

(TODO: that last "stable" or "candidate" can show without "master" pair when cherry-pick predates merge.)
`;

const scriptArgs = process.argv.slice(2); // 0 is `node` path, 1 is script full path.

if (scriptArgs.includes('--help') || scriptArgs.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}

// zx defaults to logging commands AND their full output, too noisy.
$.log = ({ kind, cmd }) => {
  if (process.env.VERBOSE && kind === 'cmd') {
    console.error(`+ ${cmd}`);
  }
};

// Using env vars to avoid separating our flags vs. git log's flags.
const DEV_REF = process.env.DEV_REF || 'live_consoledev_master';
const CANDIDATE_REF = process.env.CANDIDATE_REF || 'live_candidate';
const STABLE_REF = process.env.STABLE_REF || 'live_stable';
const EXTRA_REF =
  process.env.EXTRA_REF || (await $`git branch --show-current`).toString().trimRight();
// Hide MRs predating last merge point — no longer interesting for promotion,
// and might confusingly show on only DEV_REF side.
const BASE =
  process.env.BASE || (await $`git merge-base ${DEV_REF} ${CANDIDATE_REF}`).toString().trimRight();

const jiraPromise = getJiraStatuses(); // Start request early while we compute log...

// Author date % ad first because it survives cherry - picking so good for grouping.
// % S identifies "source" — from which commit it was reached e.g.master vs candidate.
// % w(0, 2, 2) indents following lines of message by 2 spaces.
const FORMAT =
  '%C(dim)A: %ad C: %cs %C(auto) %>(24,mtrunc)%S %H %C(dim)%s⏎ %C(reset)%w(0,2,2)%b%C(auto)%d';

// We want to run `git log` with some paths, otherwise on candidate/stable it will show many other commits
// e.g. "Merge branch 'candidate-mar-21-2023' into 'candidate'".
const gitLogArgs = scriptArgs.length > 0 ? scriptArgs : ['.'];

// If same commit is reachable from multiple refs given on single command line e.g.
// `git log --source stable candidate candidate-my-wip`
// then --source (aka %S) will only show one, but we can't control which one :-(
// We do have priorities e.g. if it's both on candidate and stable, that's because it was
// merged candidate -> stable, and we just think of that as "promoted all the way to stable".
// So for more control, do `git log` with 1 branch tip at a time, and group/de-dup below.

const gitPromises = {
  // On master, --first-parent attributes diffs to the merge commit that landed the MR.
  // ("D" - "F" merges in diagram above, rather than individual "o" commits)
  dev: $`git --no-pager log ^${BASE} ${DEV_REF} --first-parent --pretty=${FORMAT} --color=always --date=iso-strict -z ${gitLogArgs}`,

  // On candidate & stable, cherry - picked master MRs become single - parent commits.
  // Do NOT want `--first-parent` as each merge to candidate deploys multiple MRs.
  // ("e", "g", "d" picks in diagram above, rather than "*" merges)
  candidate: $`git --no-pager log ^${BASE} ${CANDIDATE_REF} --pretty=${FORMAT} --color=always --date=iso-strict -z ${gitLogArgs}`,
  stable: $`git --no-pager log ^${BASE} ${STABLE_REF} --pretty=${FORMAT} --color=always --date=iso-strict -z ${gitLogArgs}`,
};
if (EXTRA_REF) {
  gitPromises.extra = $`git --no-pager log ^${BASE} ${EXTRA_REF} --pretty=${FORMAT} --color=always --date=iso-strict -z ${gitLogArgs}`;
}

// During cherry - picking confict, the MR you're trying to add is not yet on EXTRA_REF.
if ((await $`git rev-parse --verify --quiet CHERRY_PICK_HEAD > /dev/null`.exitCode) === 0) {
  // Show only that one MR, and only if it matches given paths.
  const suffix = ' %C(bold red)(CHERRY PICKING NOW...)%C(reset)';
  gitPromises.pick = $`git --no-pager log ^CHERRY_PICK_HEAD~1 CHERRY_PICK_HEAD --first-parent --pretty=${FORMAT}${suffix} --color=always --date=iso-strict -z ${gitLogArgs}`;
}

const parseGitLog = (output, jiraData) =>
  // `git log -z` output terminated by '\0'.  Split may return empty string after last \0.
  output
    .split('\0')
    .filter(Boolean)
    .map((logEntry) => {
      const fields = logEntry.split(/ +/);
      // Similar to ./compress-git-log.mjs. No graph ascii art to deal with, just pack into 1 line.
      let line = logEntry
        .trimRight()
        .replace(/\n/g, '⏎ ')
        .replace(/See merge request /g, 'See MR ');
      line = linkify(line, terminalLink, jiraData);
      return {
        authorDate: fields[1],
        source: fields[5],
        hash: fields[6], // includes color escape sequences
        line,
      };
    });

const jiraData = await jiraPromise;
const parsedLogs = {};
await Promise.all(
  Object.entries(gitPromises).map(async ([key, promise]) => {
    parsedLogs[key] = parseGitLog((await promise).toString(), jiraData);
  }),
);

// Group by author date, it's retained when cherry-picking, so same date is _probably_ same MR.
// Within date group by hash — definitely same, usually enough to show one.
const byDate = {};
Object.entries(parsedLogs).forEach(([key, logs]) => {
  logs.forEach((entry) => {
    byDate[entry.authorDate] ||= {};
    byDate[entry.authorDate][entry.hash] ||= {};
    byDate[entry.authorDate][entry.hash][key] = entry;
  });
});

const dates = Object.keys(byDate);
dates.sort(); // by authorDate = by order MRs were merged to master
dates.reverse();
dates.forEach((date) => {
  const byHash = byDate[date];
  Object.values(byHash).forEach((byKey) => {
    // Show dev separately, even if same hash as below (because merged, or being picked).
    if (byKey.dev) {
      console.log(byKey.dev.line);
    }
    // Among these we nearly always merge, e.g. it's enough to say a cherry-pick is in stable,
    // that implies it's also in candidate.
    const leastSpecific = byKey.stable || byKey.candidate || byKey.extra || byKey.pick;
    if (leastSpecific) {
      console.log(leastSpecific.line);
    }
  });
  console.log(''); // blank line between same-authorDate groups.
});
