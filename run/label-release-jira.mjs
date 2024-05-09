#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */

import chalk from 'chalk';
import { execSync } from 'child_process';
import cliProgress from 'cli-progress';
import inquirer from 'inquirer';
import _ from 'lodash';
import { simpleGit } from 'simple-git';
import yargs from 'yargs';

import { getUpstreamRemoteName } from './upstream-name.mjs';

const jiraTicketRegex = /(OCMUI|RHBKAAS|MGMT|RHCLOUD)[- ]?([0-9]+)/gim;
const cherrypickRegex = /cherry picked from commit ([a-fA-F0-9]+)/m;
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Octr',
  'Nov',
  'Dec',
];

const flags = yargs
  .option('jira-token', { description: 'Jira token.' })
  .option('n', { description: 'Number of the last N releases to label.' })
  .version(false)
  .help(true).argv;

if (flags.jiraToken) {
  await jiraLabeler(flags.jiraToken, flags.n);
} else {
  console.error("Enable at least one flag, or what's the point?");
  yargs.showHelp();
}

async function jiraLabeler(jiraToken, total = 1) {
  const data = await initGit();
  if (!data) return;
  const { git, upstreamName } = data;

  //  get sha of master, stable, candidate
  // const masterSha = await git.revparse([`${upstreamName}/master`]);
  const stableSha = await git.revparse(['--short', `${upstreamName}/stable`]);
  const condidateSha = await git.revparse(['--short', `${upstreamName}/candidate`]);

  // get logs of those branches
  // let masterCommits = await gitLog(git, masterSha, ['--first-parent', '-n 100']);
  const candidateCommits = await gitLog(git, condidateSha, ['-n 100']);
  const candidateCommitsMap = _.keyBy(candidateCommits, 'hash');
  // filter master log to just what's in master and not candidate
  // const candidateMsgMap = _.keyBy(candidateCommits, 'message');
  // masterCommits = masterCommits.filter((commit) => !candidateMsgMap[commit.message]);
  // const masterJiraMap = getJiraCommitMap(masterCommits);
  const releases = await gitLog(git, stableSha, ['--first-parent', '-n 100']);
  // only get the commits that are merges from candidate
  // (has 2 parents where first is the previous stable commit and the second is the commit from candidate)
  const releasesMap = _.keyBy(releases, 'hash');

  const jiraMap = new Map();
  for (let i = 0; i < total; i += 1) {
    const release = releases[i];
    const releaseCommits = [];
    // get the merge commit for candidate into stable
    let parent = release.parents[1];
    // get the merge commit for master into candidate
    let commit = candidateCommitsMap[parent];
    if (commit) {
      commit = candidateCommitsMap[parent];
      if (commit) {
        commit = candidateCommitsMap[commit.parents[1]];
        // get the first commit in candidate that was cherry picked from master
        // we will walk the commits by their parents to the top
        do {
          // update parent to the previous commit in this chain of commits
          [parent] = commit.parents;
          // remember the sha of the cherry picked MR to get the original commit
          releaseCommits.push(commit);
          commit = candidateCommitsMap[parent];
        } while (commit && !releasesMap[parent] && candidateCommitsMap[parent]);
      }
    }

    if (releaseCommits.length > 0) {
      // find jira tickets in release commits
      const promotionJiraMap = getJiraCommitMap(releaseCommits);
      // sort jira tickets lowest to biggest
      const releasedJiraKeys = Object.keys(promotionJiraMap).sort((a, b) => {
        const [al, an] = a.split('-');
        const [bl, bn] = b.split('-');
        const n = al.localeCompare(bl);
        if (n === 0) {
          return Number(an) - Number(bn);
        }
        return n;
      });

      const dateName = new Date(release.commit_date).toLocaleDateString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      console.log(
        `\nFetching JIRA issues for the release on ${chalk.cyan(dateName)} ${chalk.white(release.message)}\n`,
      );
      for (let j = 0; j < releasedJiraKeys.length; j += 1) {
        const jiraKey = releasedJiraKeys[j];
        let jiraStatus = jiraMap.get(jiraKey);
        if (!jiraStatus) {
          const cmd = `curl -s -X GET -H "Authorization: Bearer ${jiraToken}" -H "Content-Type: application/json" "https://issues.redhat.com/rest/api/2/issue/${jiraKey}?fields=key,summary,priority,customfield_12315948,resolutiondate,status,issuetype,issuelinks,labels"`;
          jiraStatus = JSON.parse(execSync(cmd).toString());
          jiraMap.set(jiraKey, jiraStatus);
        }
        if (jiraStatus.errorMessages) {
          console.log(
            chalk.redBright(
              `Jira Error: ${chalk.blue(jiraKey)} ${jiraStatus.errorMessages.join(', ')}`,
            ),
          );
        } else {
          const {
            fields: { summary },
          } = jiraStatus;
          console.log(`${chalk.blue(`${jiraKey}`)} ${chalk.white(summary.slice(0, 120))}`);
        }
      }
      const d = new Date(release.commit_date);
      const galabel = `ga-released-${d.getFullYear()}${monthNames[d.getMonth()]}${d.getDate()}`;

      const questions = [
        {
          type: 'confirm',
          name: 'toBeLabeled',
          message: `\n\nOk to add '${chalk.white('deployed-production')}' and '${chalk.white(galabel)}' labels to these Jira issues ?`,
          default: true,
        },
      ];
      const answer = await inquirer.prompt(questions);
      if (answer.toBeLabeled) {
        const total = releasedJiraKeys.length;
        const progressBar = new cliProgress.SingleBar(
          {
            format: 'Labeling issues [{bar}] {value}/{total} | {message}',
          },
          cliProgress.Presets.shades_classic,
        );
        progressBar.start(total, 0, {
          message: '-',
        });

        const errors = [];
        for (let j = 0; j < total; j += 1) {
          const jiraKey = releasedJiraKeys[j];
          const jiraStatus = jiraMap.get(jiraKey);
          const {
            fields: { summary },
          } = jiraStatus;
          const addLabels = `'{ "update": { "labels": [{ "add": "deployed-production" }, { "add": "${galabel}" }] } }'`;
          const cmd = `curl -s -X PUT -H "Authorization: Bearer ${jiraToken}" -H "Content-Type: application/json" -d ${addLabels} "https://issues.redhat.com/rest/api/2/issue/${jiraKey}"`;
          const ret = execSync(cmd).toString();
          if (ret) {
            errors.push(`${jiraKey} ${JSON.parse(execSync(cmd).toString()).errorMessages}`);
          }
          progressBar.update(j + 1, { message: chalk.white(summary) });
        }
        progressBar.update(total, { message: 'done' });
        progressBar.stop();
        if (errors.length) {
          console.log('\nErrors:');
          errors.forEach((error) => console.log(chalk.red(error)));
        }
      }
    }
  }
  console.log('\n\n~done~\n');
}
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
function getJiraCommitMap(commits) {
  const jiraCommitMap = new Map();
  commits.forEach((commit) => {
    const relatedJiraKeys = getJiraKeysFromComment(commit.message + commit.body);
    relatedJiraKeys.forEach((jiraKey) => {
      let jcommits = jiraCommitMap[jiraKey];
      if (!jcommits) {
        jiraCommitMap[jiraKey] = [];
        jcommits = jiraCommitMap[jiraKey];
      }
      jcommits.push(commit);
    });
  });
  return jiraCommitMap;
}

async function initGit() {
  console.log('\nFetching GIT...');
  const git = simpleGit(process.cwd());
  const upstreamName = await getUpstreamRemoteName(git);
  try {
    await git.fetch([upstreamName]);
    return { git, upstreamName };
  } catch (e) {
    console.log(e.message);
  }
  return null;
}

async function gitLog(git, sha, xtra = []) {
  const log = await git.raw([
    ...[
      'log',
      // `--since=${lsince}`,
      '--pretty=format:òòòòòò %H ò %ai ò %s ò %D ò %B ò %aN ò %aE ò %ci ò %P ò òò',
    ],
    ...xtra,
    ...[sha],
  ]);
  return log
    .split('òòòòòò ')
    .filter((c) => !!c)
    .map((commit) => {
      const details = commit.split(' ò ');
      const ret = {
        hash: details[0],
        date: details[1],
        commit_date: details[7],
        message: details[2],
        refs: details[3],
        body: details[4],
        parents: details[8].split(' '),
        author_name: details[5],
        author_email: details[6].split(' ')[0],
      };
      const match = cherrypickRegex.exec(ret.body);
      if (match) {
        // eslint-disable-next-line prefer-destructuring
        ret.picked_hash = match[1];
      }
      return ret;
    });
}

function getJiraKeysFromComment(comment) {
  // find all jira numbers in the message
  let match;
  const set = new Set();
  // eslint-disable-next-line no-cond-assign
  while ((match = jiraTicketRegex.exec(comment)) !== null) {
    if (match.index === jiraTicketRegex.lastIndex) {
      // eslint-disable-next-line no-plusplus
      jiraTicketRegex.lastIndex++;
    }
    set.add(`${match[1].toUpperCase()}-${match[2]}`);
  }
  return Array.from(set).sort();
}
