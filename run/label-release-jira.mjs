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

if (!flags.jiraToken) {
  console.error('\nJira token is mandatory.\n');
  yargs.showHelp();
  process.exit(1);
}

await jiraLabeler(flags.jiraToken, flags.n);

async function jiraLabeler(jiraToken, total = 1) {
  const data = await initGit();
  if (!data) return;
  const { git, upstreamName } = data;

  const stableSha = await git.revparse(['--short', `${upstreamName}/stable`]);

  const stableCommits = await gitLog(git, stableSha, ['-n 100']);
  const stableCommitsMap = _.keyBy(stableCommits, 'hash');
  const releases = await gitLog(git, stableSha, ['--first-parent', '-n 100']);

  const jiraMap = new Map();
  // total = number of releases to go back
  // releases = log of the stable branch with latest first
  for (let i = 0; i < total; i += 1) {
    const release = releases[i];
    const releaseCommits = [];
    let commit;
    let parent;
    // each release is a commit in stable branch that is a merge-commit from master into stable
    // therefore the second parent will be the first cherry-picked commit
    commit = stableCommitsMap[release.parents[1]];
    do {
      // remember the cherry-picked commit
      releaseCommits.push(commit);
      // update parent to the parent of this commit in this daisy chain of commits
      [parent] = commit.parents;
      commit = stableCommitsMap[parent];
      // until we get to the merge commit in stable
      // that preceded this 'master into stable' merge commit
    } while (commit.parents.length === 1);

    if (releaseCommits.length > 0) {
      // find jira tickets in release commits
      const { jiraCommitMap, nojiraCommitArr } = getJiraCommitMap(releaseCommits);
      // sort jira tickets lowest to biggest
      const releasedJiraKeys = Object.keys(jiraCommitMap).sort((a, b) => {
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
      nojiraCommitArr.forEach((commit) => {
        console.log(
          `${chalk.yellow('NO JIRA TO LABEL')} ${chalk.white(commit.message.slice(0, 120))}`,
        );
      });
      const d = new Date(release.commit_date);
      const galabel = `ga-released-${d.getFullYear()}${monthNames[d.getMonth()]}${d.getDate()}`;

      let questions = [
        {
          type: 'confirm',
          name: 'toBeLabeled',
          message: `Ok to add '${chalk.white('deployed-production')}' and '${chalk.white(galabel)}' labels to these Jira issues ?`,
          default: false,
        },
      ];
      console.log('\n');
      let answer = await inquirer.prompt(questions);
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
            errors.push(`${jiraKey} Ensure that JIRA token has been provided and has not expired.`);
          }
          progressBar.update(j + 1, { message: chalk.white(summary) });
        }

        progressBar.update(total, { message: 'done' });
        progressBar.stop();
        if (errors.length) {
          console.log('\nErrors:');
          errors.forEach((error) => console.log(chalk.red(error)));
          return;
        }
      }

      questions = [
        {
          type: 'confirm',
          name: 'toContinue',
          message: `Continue with the release previous to this one ?`,
          default: false,
        },
      ];
      console.log('\n');
      answer = await inquirer.prompt(questions);
      if (!answer.toContinue) {
        break;
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
  const nojiraCommitArr = [];
  commits.forEach((commit) => {
    const relatedJiraKeys = getJiraKeysFromComment(commit.message + commit.body);
    if (relatedJiraKeys.length) {
      relatedJiraKeys.forEach((jiraKey) => {
        let jcommits = jiraCommitMap[jiraKey];
        if (!jcommits) {
          jiraCommitMap[jiraKey] = [];
          jcommits = jiraCommitMap[jiraKey];
        }
        jcommits.push(commit);
      });
    } else {
      nojiraCommitArr.push(commit);
    }
  });
  return { jiraCommitMap, nojiraCommitArr };
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
