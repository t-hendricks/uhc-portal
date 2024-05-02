#!/usr/bin/env node

import { Chalk } from 'chalk';
import { realpathSync } from 'fs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// See here about hyperlink escape sequence and which terminals support it:
// https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
const terminalSetURL = (url) => `\x1B]8;;${url}\x07`;
export const terminalLink = (url, text) => terminalSetURL(url) + text + terminalSetURL('');

const REPO = 'uhc-portal'; // TODO figure out from git remotes

// Kludge: get useful subset of data in single request: sort by recently changed, filter by most
// interesting statuses.  It's OK if a few cards won't get status, can always click link.

const jiraQuery =
  '(project = OCMUI AND status IN ("Review", "Closed", "Code Review")) ' +
  'OR (project = HAC AND labels = "ocm-ui" AND status IN ("Review", "Closed", "Code Review")) ' +
  'ORDER BY updatedDate desc';

// This script is all about adding escape sequences, so enable color even if stdout is a pipe.
// 1 = base 16 colors, stylable by terminal theme.
const chalk = new Chalk({ level: 1 });
const jiraStatusColors = {
  'TO DO': chalk.grey,
  'IN PROGRESS': chalk.cyan,
  'CODE REVIEW': chalk.cyan,
  REVIEW: chalk.blue,
  CLOSED: chalk.green,
};
// Only priorities listed here will be shown at all
const jiraPriorityBadges = {
  Blocker: chalk.inverse(chalk.red('\u{26D4}Blocker')), // ⛔ U+26D4 NO ENTRY
};

// { "HAC-nnn": { summary: "...", fields: { status: { name: "Closed", ... }, ... } } }
export const getJiraStatuses = async () => {
  const result = {};
  try {
    // HAC & OCMUI boards allow unauthenticated requests :-)
    // Note: Even mentioning a closed board e.g. `project in (OCMUI, OCM)` results in 400 error.
    const fields = 'key,priority,status,resolution,summary';
    const params = new URLSearchParams({ jql: jiraQuery, maxResults: 100, fields });
    const url = `https://issues.redhat.com/rest/api/2/search?${params}`;
    const response = await fetch(url);
    const body = await response.text();
    if (response.status !== 200) {
      console.error(
        `WARN: failed to fetch jira info, URL: ${url}\n` +
          `  -> ${response.status} ${response.statusText}\n` +
          `     ${body}`,
      );
    } else {
      JSON.parse(body).issues.forEach((issue) => {
        result[issue.key] = issue;
      });
    }
  } catch (e) {
    console.error(`WARN: failed to parse jira info`, e);
  }
  return result;
};

export const linkify = (text, linkFunction, jiraByKey = {}) => {
  /* eslint-disable no-param-reassign */
  // Jira cards.  lowercase `ocmui-nnn` form allowed as some folk put it in branch names.
  text = text.replace(
    /(OCMUI|HAC|RHBKAAS|MGMT|RHCLOUD|OCM|SDA|SDB)[- ](\d+)/gi,
    (match, board, id) => {
      const key = `${board.toUpperCase()}-${id}`;
      const priority = jiraByKey[key]?.fields?.priority?.name;
      const status = jiraByKey[key]?.fields?.status?.name?.toUpperCase();
      const resolution = jiraByKey[key]?.fields?.resolution?.name;
      const summary = jiraByKey[key]?.fields?.summary;
      // Kludge: stick some Jira data into URL as a way to show it in terminal tooltip.
      let url = `https://issues.redhat.com/browse/${key}`;
      if (summary) {
        url += `#summary=${summary}`;
      }
      const link = linkFunction(url, match);
      // TODO color-blind mode
      if (status) {
        const resolutionSuffix = resolution && resolution !== 'Done' ? `/${resolution}` : '';
        // ◤ U+25E4 BLACK UPPER LEFT TRIANGLE, ◢ U+25E2 BLACK LOWER RIGHT TRIANGLE
        let badge = chalk.inverse(`\u{25E4}${status}${resolutionSuffix}\u{25E2}`);
        if (jiraStatusColors[status]) {
          badge = jiraStatusColors[status](badge);
        }
        return (jiraPriorityBadges[priority] || '') + badge + link;
      }
      return link;
    },
  );

  // Git commits. Shorten on output so it's painless to feed full 40-char hashes into this script.
  text = text.replace(/[0-9a-f]{6,}/g, (match) =>
    linkFunction(
      `https://gitlab.cee.redhat.com/service/${REPO}/-/commit/${match}`,
      match.slice(0, 9),
    ),
  );

  // Merge requests, Gitlab forms: `org/repo!nnn` and just `!nnn`.
  text = text.replace(/(?:service\/(\S+))?!(\d+)/g, (match, repo, id) => {
    repo = repo || REPO;
    const url = `https://gitlab.cee.redhat.com/service/${repo}/-/merge_requests/${id}`;
    return linkFunction(url, repo === REPO ? `!${id}` : match);
  });
  // Merge request custom tags
  text = text.replace(/(?:tag: )?MRG\/(\d+)/g, (match, id) =>
    linkFunction(
      `https://gitlab.cee.redhat.com/service/${REPO}/-/merge_requests/${id}`,
      `MRG/${id}`,
    ),
  );

  return text;
  /* eslint-enable no-param-reassign */
};

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Running as script, process stdin -> stdout.
  const jiraPromise = getJiraStatuses();
  // Line-by-line is weirdly painful in NodeJS, so slurp whole input.
  const chunks = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  let text = chunks.join('');
  text = linkify(text, terminalLink, await jiraPromise);
  process.stdout.write(text);
}
