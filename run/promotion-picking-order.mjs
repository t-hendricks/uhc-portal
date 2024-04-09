#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */

import chalk from 'chalk';
import { execSync } from 'child_process';
import _ from 'lodash';
import ora from 'ora';
// Takes `DEBUG=simple-git` env var: https://github.com/steveukx/git-js/blob/main/docs/DEBUG-LOGGING-GUIDE.md
import { simpleGit } from 'simple-git';
import yargs from 'yargs';

import { getUpstreamRemoteName } from './upstream-name.mjs';

const assistedInstallerRegex =
  /^([Bb][Uu][Mm][Pp]|[Uu][Pp][Dd][Aa][Tt][Ee]).*openshift-assisted/gim;
const jiraTicketRegex = /(OCMUI|RHBKAAS|MGMT|RHCLOUD)[- ]?([0-9]+)/gim;
const cherrypickRegex = /cherry picked from commit ([a-fA-F0-9]+)/m;
const diffRegex = /^-(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;
const qeApproved = ['Closed', 'Verified', 'Release Pending'];
const sortFn = (a, b) => a - b;
const dependsOnColor = chalk.hex('#FFA500');

const flags = yargs
  .option('jira-token', { description: 'Jira token.' })
  .option('v', { description: 'Verbose.' })
  .version(false)
  .help(true).argv;

const CANDIDATE_DAYS = 30;
if (flags.jiraToken) {
  reportOrder(flags.jiraToken, !!flags.v);
} else {
  console.error("Enable at least one flag, or what's the point?");
  yargs.showHelp();
}

// //////////////////////////////////////////////////////////////
//   ____                       _      ___          _
//  |  _ \ ___ _ __   ___  _ __| |_   / _ \ _ __ __| | ___ _ __
//  | |_) / _ \ '_ \ / _ \| '__| __| | | | | '__/ _` |/ _ \ '__|
//  |  _ <  __/ |_) | (_) | |  | |_  | |_| | | | (_| |  __/ |
//  |_| \_\___| .__/ \___/|_|   \__|  \___/|_|  \__,_|\___|_|
//            |_|
// //////////////////////////////////////////////////////////////

async function reportOrder(jiraToken, verbose) {
  // //////////////////////////////////////////////////////////////
  //              _                                   _ _
  //    __ _  ___| |_    ___ ___  _ __ ___  _ __ ___ (_) |_ ___
  //   / _` |/ _ \ __|  / __/ _ \| '_ ` _ \| '_ ` _ \| | __/ __|
  //  | (_| |  __/ |_  | (_| (_) | | | | | | | | | | | | |_\__ \
  //   \__, |\___|\__|  \___\___/|_| |_| |_|_| |_| |_|_|\__|___/
  //   |___/
  // //////////////////////////////////////////////////////////////

  console.log('\nFetching commits from git...');
  const git = simpleGit(process.cwd());
  const upstreamName = await getUpstreamRemoteName(git);
  try {
    await git.fetch([upstreamName]);
  } catch (e) {
    console.log(e.message);
    return;
  }
  const masterSha = await git.revparse([`${upstreamName}/master`]);
  const condidateSha = await git.revparse(['--short', `${upstreamName}/candidate`]);
  let masterCommits = await gitLog(git, masterSha, ['--first-parent']);
  masterCommits = masterCommits.reverse();
  const candidateCommits = await gitLog(git, condidateSha);
  const candidateCommitMap = _.keyBy(candidateCommits, 'message');
  const masterCommitMap = _.keyBy(masterCommits, 'hash');
  const checkCandidateCommits = [];
  masterCommits = masterCommits.filter((commit) => {
    const ccommit = candidateCommitMap[commit.message];
    if (ccommit && Math.floor((new Date() - new Date(ccommit.date)) / 86400000) < CANDIDATE_DAYS) {
      checkCandidateCommits.push(commit);
    }
    return !ccommit;
  });
  const masterCommitsInxMap = masterCommits.reduce((acc, commit, inx) => {
    acc[commit.hash] = inx + 1;
    return acc;
  }, {});

  const combinedCommits = [...masterCommits, ...checkCandidateCommits];
  combinedCommits.forEach((commit) => {
    commit.diffHash = [`${commit.hash}^`, commit.hash];
    commit.blameHash = `${commit.hash}^`;
    commit.sash = commit.hash.substring(0, 9);
    commit.isAIPromotion = assistedInstallerRegex.test(commit.body);
    const split = commit.body.split('\n');
    // eslint-disable-next-line no-param-reassign
    commit.description = split.length > 4 ? split[2] : commit.message;
    const match = /![0-9]{4}/.exec(commit.body);
    if (match) {
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      commit.mrID = match[0];
    }
  });
  await setTrueAuthors(git, combinedCommits);
  const allCommits = combinedCommits;

  // /////////////////////////////////////////////////////////////
  //              _       _ _                 _        _
  //    __ _  ___| |_    (_|_)_ __ __ _   ___| |_ __ _| |_ ___  ___
  //   / _` |/ _ \ __|   | | | '__/ _` | / __| __/ _` | __/ _ \/ __|
  //  | (_| |  __/ |_    | | | | | (_| | \__ \ || (_| | ||  __/\__ \
  //   \__, |\___|\__|  _/ |_|_|  \__,_| |___/\__\__,_|\__\___||___/
  //   |___/           |__/
  // /////////////////////////////////////////////////////////////

  console.log('\nGetting QE statuses...');
  const jiraMap = new Map();
  masterCommits.forEach(async ({ hash }, inx) => {
    const commit = masterCommitMap[hash];
    const jira = {
      allJirasClosed: true,
      hasDoNotPromoteLabel: false,
      allDependentJirasClosed: true,
      noRelatedJiras: false,
      relatedJiraStatuses: [],
      relatedJiraKeys: [],
    };
    commit.jira = jira;
    const relatedJiraKeys = getJiraKeysFromComment(commit.message + commit.body);
    commit.jira.relatedJiraKeys = relatedJiraKeys;
    commit.noRelatedJiras = relatedJiraKeys.length === 0;
    relatedJiraKeys.forEach((jiraKey) => {
      let jiraStatus = jiraMap.get(jiraKey);
      if (!jiraStatus) {
        const cmd = `curl -s -X GET -H "Authorization: Bearer ${jiraToken}" -H "Content-Type: application/json" "https://issues.redhat.com/rest/api/2/issue/${jiraKey}?fields=key,summary,priority,customfield_12315948,resolutiondate,status,issuetype,issuelinks,labels"`;
        jiraStatus = JSON.parse(execSync(cmd).toString());
        jiraMap.set(jiraKey, jiraStatus);
      }
      if (jiraStatus.errorMessages) {
        console.log(
          chalk.redBright(`Jira Error: ${jiraKey} ${jiraStatus.errorMessages.join(', ')}`),
        );
      } else {
        const {
          // eslint-disable-next-line camelcase
          fields: { labels, status, priority, customfield_12315948, issuelinks = [], issuetype },
        } = jiraStatus;
        jira.priority = priority.name;
        jira.issuetype = issuetype.name;
        jira.qacontact = customfield_12315948?.emailAddress || 'unassigned';

        commit.noQE = labels.includes('no-qe');
        const doNotPromoteFlag = labels.includes('do-not-promote');
        const behindFeatureFlag = labels.includes('behind-feature-flag');
        if (behindFeatureFlag && !doNotPromoteFlag && !qeApproved.includes(status.name)) {
          // if qe hasn't approved we can still promote if there's a flag that says
          // feature is behind a feature flag and no flag that says do not promote
          commit.jira.relatedJiraStatuses.push(
            relatedJiraKeys.length === 1
              ? chalk.yellowBright('BEHIND FEATURE FLAG')
              : chalk.yellowBright(jiraKey),
          );
        } else if (!qeApproved.includes(status.name) && !commit.noQE) {
          commit.jira.relatedJiraStatuses.push(
            chalk.redBright(
              `${
                relatedJiraKeys.length === 1
                  ? chalk.redBright(status.name.toUpperCase())
                  : chalk.redBright(jiraKey)
              }: ${jira.qacontact}`,
            ),
          );
          jira.allJirasClosed = false;
        } else {
          // if here, jira is closed
          let isClosed = true;
          // see if it has 'do-not-promote'
          if (doNotPromoteFlag) {
            commit.jira.relatedJiraStatuses.push(
              relatedJiraKeys.length === 1
                ? chalk.yellowBright("DON'T PROMOTE LABEL")
                : chalk.redBright(jiraKey),
            );
            jira.hasDoNotPromoteLabel = true;
            isClosed = false;
          }

          // or it depends on another jira
          issuelinks.forEach(({ type, outwardIssue }) => {
            if (type.name === 'Depend' && outwardIssue && jiraTicketRegex.test(outwardIssue.key)) {
              if (!qeApproved.includes(outwardIssue.fields.status.name)) {
                commit.jira.relatedJiraStatuses.push(
                  relatedJiraKeys.length === 1
                    ? chalk.redBright('DEPENDENT JIRAS NOT CLOSED')
                    : chalk.redBright(jiraKey),
                );
                jira.allDependentJirasClosed = false;
                isClosed = false;
              }
            }
          });

          if (isClosed && !commit.noQE) {
            commit.jira.relatedJiraStatuses.push(
              relatedJiraKeys.length === 1
                ? chalk.greenBright(status.name.toUpperCase())
                : chalk.greenBright(jiraKey),
            );
          }
        }
      }
    });

    if (commit.noRelatedJiras) {
      commit.jira.qeNotRequested = true;
      commit.jira.relatedJiraStatuses.push(
        chalk.redBright(chalk.yellowBright('JIRA TICKET NOT FOUND')),
      );
    } else if (commit.noQE) {
      commit.jira.qeNotRequested = true;
      commit.jira.relatedJiraStatuses.push(chalk.redBright(chalk.greenBright('QE NOT REQUIRED')));
    } else if (jira.allJirasClosed && jira.allDependentJirasClosed && !jira.hasDoNotPromoteLabel) {
      commit.jira.qeReady = true;
      commit.jira.relatedJiraStatuses = [chalk.greenBright(`QE READY`)];
    }
    commit.jira.qeStatus = commit.jira.relatedJiraStatuses.join(', ');
    let { message } = commit;
    if (message.length > 84) {
      message = `${message.slice(0, 84)}...`;
    }
    console.log(
      `   ${chalk.whiteBright(`${(inx + 1).toString().padStart(2)}.`)} ${chalk.blueBright(
        commit.sash,
      )} ${chalk.green(commit.author_email)} ${chalk.whiteBright(message)} ${commit.jira.qeStatus}`,
    );
  });

  // /////////////////////////////////////////////////////////////
  //              _                          _                               _
  //    __ _  ___| |_   _ __ ___  __ _ _   _(_)_ __ ___ _ __ ___   ___ _ __ | |_ ___
  //   / _` |/ _ \ __| | '__/ _ \/ _` | | | | | '__/ _ \ '_ ` _ \ / _ \ '_ \| __/ __|
  //  | (_| |  __/ |_  | | |  __/ (_| | |_| | | | |  __/ | | | | |  __/ | | | |_\__ \
  //   \__, |\___|\__| |_|  \___|\__, |\__,_|_|_|  \___|_| |_| |_|\___|_| |_|\__|___/
  //   |___/                        |_|
  // /////////////////////////////////////////////////////////////

  let i;
  console.log('\nDetermine if a commit depends on code changes in a previous commit...');
  for (i = 0; i < allCommits.length; i += 1) {
    const commit = allCommits[i];

    // list changed files in this commit
    const diffs = await git.diff([
      '-z',
      '-U1', // one context line to emulate git merge algo
      '--diff-filter=AMDR',
      '--find-renames',
      ...commit.diffHash,
    ]);

    // split into files that changed
    const commitUponInxSet = new Set();
    commit.changes = getCommitChanges(diffs);

    let { description } = commit;
    if (description.length > 64) {
      description = `${description.slice(0, 64)}...`;
    }

    if (i === masterCommits.length) {
      console.log('\nDetermine if commits in Candidate were picked out of order...');
    }
    const candidateCommit = i >= masterCommits.length;
    const lineNum = i >= masterCommits.length ? `c${i - masterCommits.length + 1}` : i + 1;
    const commitDetails = `${chalk.whiteBright(
      `${lineNum.toString().padStart(2)}.`,
    )} ${chalk.blueBright(commit.sash)} ${chalk.white(commit.mrID)} (${
      commit.changes.length
    }) ${chalk.green(commit.author_email)} ${chalk.whiteBright(description)}`;

    const spinner = ora({
      text: commitDetails,
      isSilent: candidateCommit,
      spinner: {
        interval: 80,
        frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
      },
      stream: process.stdout,
    }).start();
    const overlapMap = {};
    const promises = commit.changes
      // eslint-disable-next-line no-nested-ternary
      .sort((a, b) => (!a.filename === !b.filename ? 0 : a.filename ? -1 : 1))
      .map((change) => {
        const { filename, filestate, diffFile } = change;
        if (!filename) {
          return Promise.resolve();
        }
        const blameCmd = ['blame', '-M', '-l', '--first-parent'];
        // avoid setting a 'since' because if the commit is just a hair longer the the since,
        // the blame hash comes back with ^899823 which won't match an existing commit below.
        // yarn.lock is an exception because it's big and blame takes a minute sometimes
        if (filename.includes('yarn.lock')) {
          blameCmd.push(`--since=3.months`);
        }
        blameCmd.push(commit.blameHash);
        blameCmd.push(filename);
        return git
          .raw(blameCmd)
          .catch(() => null)
          .then((result) => {
            if (!result) return;
            const blames = result.split('\n').map((blame) => {
              const inx1 = blame.indexOf(' ');
              const inx2 = blame.indexOf(')', inx1);
              return {
                hash: blame.slice(0, inx1).trim(),
                line: blame.slice(inx2 + 1).trim(),
                other: blame.slice(inx1 + 1, inx2),
              };
            });

            // find changes this commit made in this file
            // and what previous commits this change is built upon
            const changes = diffFile.split('\n@@ ');
            for (let k = 1; k < changes.length; k += 1) {
              const change = changes[k];
              let [, oofs, ocnt] = diffRegex.exec(change);
              // if old version zero count, the new version doesn't change old version
              // so new version doesn't conflict with anything in old version so no conflict
              if (ocnt !== '0') {
                // on the other hand if old count is missing, that means new version changed one line in old version
                oofs = parseInt(oofs, 10);
                ocnt = ocnt && parseInt(ocnt, 10);
                const oend = ocnt ? oofs + ocnt : oofs;
                const upons = [];
                let hasUpons = false;

                const blimes = blames.slice(oofs - 1, oend - 1); // diff is 1 based, blames is 0 based
                blimes.forEach((blame) => {
                  const inx = masterCommitsInxMap[blame.hash];
                  upons.push(inx);
                  if (inx) {
                    hasUpons = true;
                    commitUponInxSet.add(inx);

                    // if this commit is already in candidate, list git commands that cn fix the conflicts
                    if (candidateCommit) {
                      const masterCommit = masterCommits[inx - 1];
                      masterCommit.prepickedConflict = true;
                      let fixes = masterCommit.prepickedConflictFixes;
                      if (!fixes) {
                        // eslint-disable-next-line no-multi-assign
                        fixes = masterCommit.prepickedConflictFixes = new Set();
                      }
                      fixes.add(`git show ${commit.sash}:${filename} > ${filename}`);
                    }
                  }
                });

                if (verbose && hasUpons) {
                  let overlaps = overlapMap[filestate];
                  if (!overlaps) {
                    // eslint-disable-next-line no-multi-assign
                    overlaps = overlapMap[filestate] = [];
                  }
                  const basedUpon = [];
                  overlaps.push(basedUpon);
                  basedUpon.push([`${chalk.white('                   -----------------')}`]);
                  let uinx = 0;
                  // handle start of diff lines
                  const strt = change.indexOf('@@');
                  let lines = change.slice(strt + 2).split('\n');
                  lines.shift();
                  lines = lines.reduce((acc, line) => {
                    let ln;
                    let lnNum = (oofs + uinx).toString().padStart(4);
                    let upon = upons[uinx] ? `${upons[uinx].toString().padStart(2)}.` : '   ';
                    if (line.startsWith('-')) {
                      ln = chalk.red(line);
                      upon = dependsOnColor(upon);
                    } else if (line.startsWith('+')) {
                      lnNum = '    ';
                      uinx -= 1;
                      upon = '   ';
                      ln = chalk.green(line);
                    } else {
                      upon = dependsOnColor(upon);
                      ln = chalk.white(`${line} ${chalk.italic('(context)')}`);
                    }
                    ln = `           ${chalk.white(`${lnNum}`)}  ${upon}  ${ln}`;
                    acc.push(ln);
                    uinx += 1;
                    return acc;
                  }, []);
                  basedUpon.push(lines);
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
            if (spinner) {
              spinner.fail();
            }
          });
      });
    await Promise.allSettled(promises);
    let dependsOn = '';
    if (commitUponInxSet.size) {
      const dependsOnInxs = `DEPENDS ON EDITS MADE IN ${Array.from(commitUponInxSet)
        .sort(sortFn)
        .join('. ')}.`;
      dependsOn = candidateCommit ? chalk.red(dependsOnInxs) : dependsOnColor(dependsOnInxs);
    }

    spinner.stopAndPersist({
      text: ` ${commitDetails} ${dependsOn}`,
    });
    if (candidateCommit && commitUponInxSet.size) {
      console.log(` ${commitDetails} ${dependsOn}`);
    }
    if (verbose && (!candidateCommit || (candidateCommit && Object.entries(overlapMap).length))) {
      Object.entries(overlapMap).forEach(([filestate, overlaps]) => {
        console.log(`      ${filestate}`);
        overlaps.forEach((overlap) => {
          overlap.forEach((diff) => diff.forEach((line) => console.log(line)));
        });
      });
    }
    commit.changesFrom = Array.from(commitUponInxSet).sort(sortFn);
  }

  // /////////////////////////////////////////////////////////////
  //         _      _    _                             _
  //   _ __ (_) ___| | _(_)_ __   __ _    ___  _ __ __| | ___ _ __
  //  | '_ \| |/ __| |/ / | '_ \ / _` |  / _ \| '__/ _` |/ _ \ '__|
  //  | |_) | | (__|   <| | | | | (_| | | (_) | | | (_| |  __/ |
  //  | .__/|_|\___|_|\_\_|_| |_|\__, |  \___/|_|  \__,_|\___|_|
  //  |_|                        |___/
  // /////////////////////////////////////////////////////////////
  const ready = [];
  const allHashes = [];
  const releaseNotes = [];
  const heldBackNotes = [];
  const doNotPromote = [];
  const dependson = [];
  const qeNotReady = [];
  const qeOnRequiredNotReady = [];
  const AICommits = [];
  const allBlockingCommits = {};
  let conflictFixes = [];
  masterCommits.forEach((commit, inx) => {
    commit.inx = inx;
    markRequiredCommits(masterCommits, commit);
    commit.blockingCommits = getBlockingCommits(masterCommits, commit, allBlockingCommits);
  });
  masterCommits.forEach((commit, inx) => {
    const { jira, date, sash, blockingCommits, isAIPromotion } = commit;

    // does this commit depend on the code in a previous commit
    const requiredInxs = getCodeDependencies(commit);
    const required = requiredInxs.length
      ? dependsOnColor(`REQUIRES: ${requiredInxs.join('. ')}. `)
      : '';

    const cherryPick = chalk.blue(`git cherry-pick -x -m 1 ${sash}`);
    commit.cherryPick = cherryPick;
    let description = chalk.dim(chalk.white(`${commit.description.slice(0, 44)}`));
    const { priority, issuetype = '' } = commit.jira;
    if (priority === 'Critical' || priority === 'Blocker') {
      description = `${chalk.white(`<<${priority}>>`)} ${description}`;
    }
    const { qeStatus } = commit.jira;
    let picks = ready;
    let conflicted = '';
    const note = `| ${sash} | ${
      commit.jira.relatedJiraKeys.length ? commit.jira.relatedJiraKeys.join(', ') : '-'
    } | ${commit.description} | ${commit.mrID} ${commit.author_email}|`;
    if (isAIPromotion) {
      picks = AICommits;
    } else if (blockingCommits.length) {
      picks = qeOnRequiredNotReady;
      heldBackNotes.push(
        `${note} ${chalk.red(`REQUIRES PROMOTION OF: ${blockingCommits.join(',')}`)} |`,
      );
    } else if (commit.jira.qeReady || commit.jira.qeNotRequested) {
      picks = ready;
      releaseNotes.push(note);
      if (commit.prepickedConflict) {
        conflicted = chalk.red('*');
        const fixes = Array.from(commit.prepickedConflictFixes);
        allHashes.push(
          `${sash}   ${chalk.red(
            '* will cause a conflict when picked, because it depends on a commit that was picked into candidate first',
          )}\n${chalk.white(
            'Try fixing this conflict with the original commit files:',
          )}\n${chalk.blue(fixes.join('\n'))}\n`,
        );
        conflictFixes = [...conflictFixes, ...fixes];
      } else if (requiredInxs.some((inx) => masterCommits[inx - 1].isAIPromotion)) {
        conflicted = chalk.red('*');
        allHashes.push(
          `${sash}   ${chalk.red(
            '* will cause a conflict when picked, because this commit depends on an AI promotion which we cannot promote',
          )}`,
        );
      } else {
        allHashes.push(sash);
      }
    } else if (jira.hasDoNotPromoteLabel) {
      picks = doNotPromote;
      heldBackNotes.push(`${note} ${qeStatus} |`);
    } else if (!jira.allDependentJirasClosed) {
      picks = dependson;
      heldBackNotes.push(`${note} ${qeStatus} |`);
    } else {
      picks = qeNotReady;
      heldBackNotes.push(`${note} ${qeStatus} |`);
    }
    let lineNum = `${(inx + 1).toString().padStart(2)}.`;
    lineNum = commit.hasRequires ? dependsOnColor(lineNum) : chalk.whiteBright(lineNum);

    picks.push(
      `${lineNum} ${cherryPick}${conflicted} ${chalk.white(commit.mrID)} (${
        commit.changes.length
      }) ${chalk.green(commit.author_email)} ${required}${
        verbose ? ` ${getDaysAgo(date)} ` : ''
      }${qeStatus} ${issuetype === 'Bug' ? 'Bug' : ''}  ${description}`,
    );

    commit.logLine = `${lineNum} ${chalk.white(commit.mrID)} ${chalk.green(commit.author_email)} ${qeStatus} ${chalk.white(`${commit.description.slice(0, 100)}`)}`;
  });

  if (masterCommits.length) {
    const dateName = new Date().toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const branchName = dateName.replaceAll(',', '').replaceAll(' ', '-');

    // /////////////////////////////////////////////////////////////
    //   ___  _   _                 _        __                            _   _
    // / _ \| |_| |__   ___ _ __  (_)_ __  / _| ___  _ __ _ __ ___   __ _| |_(_) ___  _ __
    // | | | | __| '_ \ / _ \ '__| | | '_ \| |_ / _ \| '__| '_ ` _ \ / _` | __| |/ _ \| '_ \
    // | |_| | |_| | | |  __/ |    | | | | |  _| (_) | |  | | | | | | (_| | |_| | (_) | | | |
    // \___/ \__|_| |_|\___|_|    |_|_| |_|_|  \___/|_|  |_| |_| |_|\__,_|\__|_|\___/|_| |_|
    // /////////////////////////////////////////////////////////////

    console.log('\n==============================================================');
    console.log('==============================================================');
    console.log('\n------- Other Information -------\n');
    if (doNotPromote.length) {
      console.log("\nAssisted Installer commits--we don't promote these.\n");
      AICommits.forEach((pick) => console.log(pick));

      console.log(
        "\n\nMaster commit messages not found in candidate, but their jira tickets have 'do-not-promote' label\n",
      );
      doNotPromote.forEach((pick) => console.log(pick));
    }
    if (dependson.length) {
      console.log(
        '\n\nMaster commit messages not found in candidate, but not all jira tickets they depends on are Closed\n',
      );
      dependson.forEach((pick) => console.log(pick));
    }
    if (qeNotReady.length) {
      console.log(
        `\n\nMaster commit messages not found in candidate (${qeNotReady.length}), but not all associated jira tickets are Closed\n`,
      );
      qeNotReady.forEach((pick) => console.log(pick));
    }
    if (qeOnRequiredNotReady.length) {
      console.log(
        '\n\nMaster commit messages not found in candidate, and all associated jira tickets are Closed, but these commits depend on commits whose jira tickets are not Closed\n',
      );
      qeOnRequiredNotReady.forEach((pick) => console.log(pick));
    }
    console.log('\n\n');

    // /////////////////////////////////////////////////////////////
    //   ____      _                       _   _       _
    //  |  _ \ ___| | ___  __ _ ___  ___  | \ | | ___ | |_ ___  ___
    //  | |_) / _ \ |/ _ \/ _` / __|/ _ \ |  \| |/ _ \| __/ _ \/ __|
    //  |  _ <  __/ |  __/ (_| \__ \  __/ | |\  | (_) | ||  __/\__ \
    //  |_| \_\___|_|\___|\__,_|___/\___| |_| \_|\___/ \__\___||___/
    // /////////////////////////////////////////////////////////////

    console.log('\n=============================RELEASE NOTES=================================');
    console.log(
      '\n\nRelease Notes (copy & paste into  https://gitlab.cee.redhat.com/service/uhc-portal/-/wikis/Release-Notes)\n',
    );
    console.log(`\n### ${branchName}\n\n > _status: draft_\n`);
    console.log('| revision | ticket | description | MR |');
    console.log('| --- | --- | --- | --- |');
    releaseNotes.reverse().forEach((note) => console.log(note));

    // /////////////////////////////////////////////////////////////
    //   _   _      _     _   ____             _      _   _       _
    //  | | | | ___| | __| | | __ )  __ _  ___| | __ | \ | | ___ | |_ ___  ___
    //  | |_| |/ _ \ |/ _` | |  _ \ / _` |/ __| |/ / |  \| |/ _ \| __/ _ \/ __|
    //  |  _  |  __/ | (_| | | |_) | (_| | (__|   <  | |\  | (_) | ||  __/\__ \
    //  |_| |_|\___|_|\__,_| |____/ \__,_|\___|_|\_\ |_| \_|\___/ \__\___||___/
    //
    // /////////////////////////////////////////////////////////////

    if (heldBackNotes.length) {
      console.log(
        '\n=============================HELD BACK NOTES=================================',
      );
      console.log(
        '\n\nHeld Back Notes (copy & paste into  https://gitlab.cee.redhat.com/service/uhc-portal/-/wikis/Held-Back-Notes)\n',
      );
      console.log(`\n### ${dateName}\n`);
      console.log('| revision | ticket | description | MR | reason |');
      console.log('| --- | --- | --- | --- | --- |');
      heldBackNotes.reverse().forEach((note) => console.log(note));
    }
    console.log('\n\n=============================BLOCKERS=================================');
    if (Object.keys(allBlockingCommits).length) {
      console.log('\nThese commit approvals are holding back these commits.\n');
      Object.entries(allBlockingCommits).forEach(([key, set]) => {
        console.log(`${masterCommits[key].logLine}`);
        console.log(`         ${Array.from(set).join(' ')}`);
        console.log('\n');
      });
    }

    // /////////////////////////////////////////////////////////////
    //    ____ _                                      _      _      _ _     _
    //   / ___| |__   ___ _ __ _ __ _   _       _ __ (_) ___| | __ | (_)___| |_
    //  | |   | '_ \ / _ \ '__| '__| | | |_____| '_ \| |/ __| |/ / | | / __| __|
    //  | |___| | | |  __/ |  | |  | |_| |_____| |_) | | (__|   <  | | \__ \ |_
    //   \____|_| |_|\___|_|  |_|   \__, |     | .__/|_|\___|_|\_\ |_|_|___/\__|
    //                              |___/      |_|
    // /////////////////////////////////////////////////////////////

    console.log('\n=============================CHERRY PICKS=================================');
    console.log(
      `\nTo start, use this: ${chalk.blueBright(`git checkout -b ${branchName} ${condidateSha}`)}`,
    );
    console.log(`\nTo cherry-pick all ${ready.length} ready commits at once, execute:`);
    let arr = [];
    const quickLog = [];
    for (let i = 0; i < allHashes.length; i += 1) {
      const sash = allHashes[i];
      const conflictPick = sash.indexOf('*') !== -1;
      if (!conflictPick) {
        arr.push(sash);
      }
      if (arr.length && (i === allHashes.length - 1 || conflictPick)) {
        quickLog.push(chalk.blue(`git cherry-pick -x -m 1 ${arr.join('  ')}`));
        arr = [];
      }
      if (conflictPick) {
        quickLog.push(chalk.blue(`git cherry-pick -x -m 1 ${sash}`));
      }
    }
    quickLog.forEach((pick) => console.log(pick));

    console.log(
      `\nTo cherry-pick ${ready.length} ready commits one commit at a time BUT in this order, execute:`,
    );
    ready.forEach((pick) => console.log(pick));

    console.log(
      '\nTo open Merge Request: https://gitlab.cee.redhat.com/service/uhc-portal/-/merge_requests/4xxx',
    );
    console.log('To open Jira issue: https://issues.redhat.com/browse/OCMxxx');
    console.log('\n');
    // /////////////////////////////////////////////////////////////
    //     ____  _
    //  / ___|| |_ ___ _ __  ___
    //  \___ \| __/ _ \ '_ \/ __|
    //   ___) | ||  __/ |_) \__ \
    //  |____/ \__\___| .__/|___/
    //                |_|
    // /////////////////////////////////////////////////////////////

    console.log('\n=============================STEPS=================================');
    console.log(`\nSuggested steps:`);

    console.log(`\n${chalk.white('1.')} Create a new CANDIDATE branch with:`);
    console.log(`${chalk.blueBright(`git checkout -b ${branchName} ${condidateSha}`)}\n`);

    console.log(`\n${chalk.white('2.')} Cherry-pick these commits into that branch:`);
    quickLog.forEach((pick) => console.log(pick));

    console.log(`\n${chalk.white('3.')} If you encounter a conflict:`);
    if (conflictFixes.length) {
      console.log(
        `   ${chalk.white('a.')} Some conflicts can be fixed by using the version of the file in CANDIDATE`,
      );
      conflictFixes.forEach((fix) => {
        console.log(
          `        For this file:${chalk.blue(fix.split('>')[1])}, try using this: ${chalk.blue(fix)}`,
        );
      });
    }
    console.log(
      `   ${chalk.white('b.')} If commit is a simple addition or deletion of lines, resolve with our/your version.`,
    );
    console.log(
      `   ${chalk.white('c.')} When done, commit changes (don't push) and continue with: ${chalk.blue('git cherry-pick --continue')}`,
    );
    console.log(
      `   ${chalk.white('d.')} If you make a mistake, restart with: ${chalk.blueBright(`git cherry-pick --abort`)}`,
    );

    console.log(`\n${chalk.white('4.')} When done, push this branch to your fork.\n`);

    console.log(
      `\n${chalk.white('5.')} In GITLAB create an MR between your fork and the CANDIDATE branch.`,
    );
    console.log(
      `   ${chalk.white('a.')} For template dropdown choose: ${chalk.blue('release-candidate')}`,
    );
    console.log(`   ${chalk.white('b.')} Do not SQUASH`);

    console.log(`   ${chalk.white('c.')} Pander for approvers`);
    console.log(`   ${chalk.white('d.')} Merge into CANDIDATE`);

    console.log(
      `\n${chalk.white('6.')} In GITLAB MR tab, click 'New merge request' in upper right.`,
    );
    console.log(`   ${chalk.white('a.')} Source branch = ${chalk.blue('candidate')}`);
    console.log(`   ${chalk.white('b.')} Target branch = ${chalk.blue('stable')}`);
    console.log(`   ${chalk.white('c.')} Click ${chalk.blue('Compare branches and continue')}`);
    console.log(
      `   ${chalk.white('d.')} For template dropdown choose: ${chalk.blue('GA-release')}`,
    );
    console.log(`   ${chalk.white('e.')} Wait for build to be successful then merge, no SQUASHING`);

    console.log(`\n${chalk.white('7.')} Update two tables:`);
    console.log(`   ${chalk.white('a.')} Copy Release notes from above and paste into:`);
    console.log(
      `        ${chalk.blue('https://gitlab.cee.redhat.com/service/uhc-portal/-/wikis/Release-Notes')}`,
    );
    console.log(`   ${chalk.white('b.')} Copy Held back from above and paste into:`);
    console.log(
      `        ${chalk.blue('https://gitlab.cee.redhat.com/service/uhc-portal/-/wikis/Held-Back-Notes')}`,
    );
    console.log(`   ${chalk.white('c.')} Announce the release on: ${chalk.blue(' #ocm-osd-ui')}`);
    console.log('\n\n');
  } else {
    console.log(chalk.grey('\n\n\n~~no squirrels~~'));
  }
}

// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////

function getCommitChanges(diffs) {
  let i;
  const changes = [];
  diffs = diffs.split('diff --git ');
  for (i = 1; i < diffs.length; i += 1) {
    const diffFile = diffs[i];

    // get file state (Added, Deleted, Modified, Renamed)
    let filename;
    let filestate;
    const filechange = {};
    let match = /\n--- a\/(.*)\n\+\+\+ b\/(.*)/.exec(diffFile);
    if (match) {
      if (match[1] !== match[2]) {
        const to = match[2].split('/').pop();
        filestate = ` ${chalk.greenBright('R')}  ${match[1]} --> ${to}`;
      } else {
        filestate = ` ${chalk.green('M')}  ${match[1]}`;
      }
      // eslint-disable-next-line prefer-destructuring
      filename = match[1];
    } else {
      match = /\n--- a\/(.*)/.exec(diffFile);
      if (match) {
        filestate = ` ${chalk.redBright(`D  ${match[1]}`)}`;
      }
      match = /\n\+\+\+ b\/(.*)/.exec(diffFile);
      if (match) {
        filestate = ` ${chalk.cyanBright(`A  ${match[1]}`)}`;
      }
    }
    if (!filestate) {
      match = /a\/(.*) b\/(.*)/.exec(diffFile.split('\n')[0]);
      if (match) {
        filestate = `  ${chalk.greenBright('R')}  ${match[1]} --> ${match[2]}`;
      }
    }

    if (filestate) {
      filechange.filestate = filestate;
      filechange.filename = filename;
      filechange.diffFile = diffFile;
      changes.push(filechange);
    }
  }
  return changes;
}

// does this commit depend on cherry picking another commit
// but that other commit doesn't have qe approval yet?
function getBlockingCommits(masterCommits, theCommit, allBlockingCommits) {
  const { jira } = theCommit;
  const { qeReady, qeNotRequested } = jira;
  const set = new Set();
  // only consider code dependencies if this commit has qe approval
  // we're just looking for dependent missing approvals at this point
  if (qeReady || qeNotRequested) {
    const addBlockingCommits = (commit) => {
      const { changesFrom } = commit;
      changesFrom.forEach((inx) => {
        const from = masterCommits[inx - 1];
        if (!from.jira.qeReady && !from.jira.qeNotRequested) {
          from.isBlocking = true;
          set.add(from.mrID);

          // keep track of how many commits this commit blocks
          let aset = allBlockingCommits[from.inx];
          if (!aset) {
            // eslint-disable-next-line no-multi-assign
            aset = allBlockingCommits[from.inx] = new Set();
          }
          aset.add(theCommit.inx + 1);
        }
        // does this commit in turn depend on other code changes
        addBlockingCommits(from);
      });
    };
    addBlockingCommits(theCommit);
  }
  return Array.from(set);
}
function markRequiredCommits(masterCommits, theCommit) {
  const addRequiredCommits = (commit) => {
    const { changesFrom } = commit;
    changesFrom.forEach((inx) => {
      const from = masterCommits[inx - 1];
      from.hasRequires = true;
      addRequiredCommits(from);
    });
  };
  addRequiredCommits(theCommit);
}

function getCodeDependencies(commit) {
  const requiredInxs = [];
  const { changesFrom } = commit;
  changesFrom.forEach((inx) => {
    requiredInxs.push(inx);
  });
  return requiredInxs;
}

async function gitLog(git, sha, xtra = []) {
  const log = await git.raw([
    ...['log', '--pretty=format:òòòòòò %H ò %ai ò %s ò %D ò %B ò %aN ò %aE ò %ci ò %P ò òò'],
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
      // get hash of commit which was the source to this cherry-pick
      const match = cherrypickRegex.exec(ret.body);
      if (match) {
        // eslint-disable-next-line prefer-destructuring
        ret.picked_hash = match[1];
      }
      return ret;
    });
}

async function setTrueAuthors(git, commits) {
  // we have the author of who clicked the merge button
  // but not the author who wrote the original commit
  for (let i = 0; i < commits.length; i += 1) {
    const commit = commits[i];
    if (commit.parents.length > 1) {
      const parent = await git.raw([
        ...['log', '--pretty=format:òòòòòò %aN ò %aE ò òò'],
        ...['-n 1'],
        ...[commit.parents[1]],
      ]);
      const parentAuthor = parent.replace('òòòòòò ', '').split(' ò ');
      if (!parentAuthor[0].includes('RENOVATE_TOKEN')) {
        // eslint-disable-next-line prefer-destructuring
        commit.author_name = parentAuthor[0];
        // eslint-disable-next-line prefer-destructuring
        commit.author_email = parentAuthor[1];
      }
    }
  }
}

function getDaysAgo(date) {
  const daysAgo = Math.floor((new Date() - new Date(date)) / 86400000);
  if (daysAgo === 0) {
    return 'today';
  }
  if (daysAgo === 1) {
    return 'yesterday';
  }
  return `${daysAgo} days ago`;
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
