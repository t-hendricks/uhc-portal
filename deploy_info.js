#!/usr/bin/env node
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { execFileSync } = require('child_process');
const listGitRemotes = util.promisify(require('list-git-remotes'));
const fetch = require('node-fetch');
const JSON5 = require('json5');
const yargs = require('yargs');

const flags = yargs
  .option('json', { description: 'Output detailed JSON.' })
  .option('short', { description: 'Output name & hash summary.' })
  .option('set-git-branches', { description: 'Create/update git branches.' })
  .option('git-graph', { description: 'Show git graph. Implies --set-git-branches.' })
  .version(false)
  .help(true)
  .argv;

const getUpstreamRemote = async () => {
  const remoteUrls = await listGitRemotes(__dirname);
  for (const remoteName of Object.keys(remoteUrls)) {
    if (remoteUrls[remoteName].match('.*gitlab\\.cee\\.redhat\\.com[:/]service/uhc-portal.*')) {
      return remoteName;
    }
  }
  throw 'missing remote for uhc-portal repo';
};

// Helpers returning a promise, should resolve to an object containing *at least* .src_hash.

const gitBranch = async (branch) => {
  try {
    const r = await execFile('git', ['rev-parse', '--short=7', branch]);
    return { src_hash: r.stdout.trimRight() };
  } catch (err) {
    return { ERROR: err };
  }
};

// app.info.json files generated in push_to_insights.sh & insights-Jenkinsfile
const appInfo = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  try {
    // Some contain a trailing comma, making it invalid JSON, so use JSON5.
    return JSON5.parse(text);
  } catch (err) {
    return { ERROR: `${err} - ${text}` };
  }
};

const getEnvs = async (upstream) => {
  let envs = [
    // .info fields are promises, later replaced with their results..
    {
      name: `${upstream}/master`,
      comment: 'https://gitlab.cee.redhat.com/service/uhc-portal/commits/master',
      info: gitBranch(`${upstream}/master`),
    },
    {
      name: 'build_pushed_master',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-staging/',
      comment: 'Build pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/qa-stable',
      info: appInfo('https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/qa-stable/app.info.json'),
    },
    {
      name: 'live_master',
      ci_job: 'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/qa-stable/',
      comment: 'Live at https://qaprodauth.console.redhat.com/openshift/',
      info: appInfo('https://qaprodauth.console.redhat.com/apps/openshift/app.info.json'),
    },
    {
      name: 'build_pushed_beta_master',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-staging/',
      comment: 'Build also pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/qa-beta',
      info: appInfo('https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/qa-beta/app.info.json'),
    },
    {
      name: 'live_beta_master',
      ci_job: 'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/qa-beta/',
      comment: 'Live at https://qaprodauth.console.redhat.com/beta/openshift/',
      info: appInfo('https://qaprodauth.console.redhat.com/beta/apps/openshift/app.info.json'),
    },
    {
      name: `${upstream}/candidate`,
      comment: 'https://gitlab.cee.redhat.com/service/uhc-portal/commits/candidate',
      info: gitBranch(`${upstream}/candidate`),
    },
    {
      name: 'build_pushed_candidate',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-candidate/',
      comment: 'Build pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/prod-beta',
      info: appInfo('https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/prod-beta/app.info.json'),
    },
    {
      name: 'live_candidate',
      ci_job: 'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/prod-beta/',
      comment: 'Live at https://console.redhat.com/beta/openshift/',
      info: appInfo('https://console.redhat.com/beta/apps/openshift/app.info.json'),
    },

    {
      name: `${upstream}/stable`,
      comment: 'https://gitlab.cee.redhat.com/service/uhc-portal/commits/stable',
      info: gitBranch(`${upstream}/stable`),
    },
    {
      name: 'build_pushed_stable',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-stable/',
      comment: 'Build pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/prod-stable',
      info: appInfo('https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/prod-stable/app.info.json'),
    },
    {
      name: 'live_stable',
      ci_job: 'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/prod-stable/',
      comment: 'PRODUCTION - Live at https://console.redhat.com/openshift/',
      info: appInfo('https://console.redhat.com/apps/openshift/app.info.json'),
    },
  ];
  // Resolve all .info in parallel.
  await Promise.all(envs.map(async (e) => {
    e.info = await e.info;
  }));
  return envs;
};

const main = async () => {
  try {
    if (!flags.json && !flags.short && !flags.setGitBranches && !flags.gitGraph) {
      console.error("Enable at least one flag, or what's the point?");
      yargs.showHelp();
      return;
    }

    const upstream = await getUpstreamRemote();
    await execFile('git', ['fetch', upstream]);
    const envs = await getEnvs(upstream);

    if (flags.json) {
      console.log(JSON.stringify(envs, null, 2));
    }

    const widestName = Math.max(...envs.map(e => e.name.length));

    if (flags.short) {
      envs.forEach((e) => {
        console.log(e.name.padStart(widestName, ' '), e.info.src_hash);
      });
    }

    if (flags.setGitBranches || flags.gitGraph) {
      envs.forEach((e) => {
        // Don't try overwriting branches taken from git like `upstream/master`
        // (would probably be a no-op but safer not to).
        if (e.name.match('build_pushed_.*|live_.*') && e.info.src_hash) {
          const cmd = ['git', 'branch', '--force', e.name, e.info.src_hash];
          console.log('git branch --force', e.name.padStart(widestName, ' '), e.info.src_hash);
          execFileSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
        } else {
          console.log('#                 ', e.name.padStart(widestName, ' '), e.info.src_hash);
        }
      });
    }

    if (flags.gitGraph) {
      const cmd = [
        'env', 'GIT_PAGER=', 'git', 'log', ...envs.map(e => e.name),
        // Limit graph scope by omitting everything including 2 prod deploys ago.
        '--not', 'live_stable~2', '--oneline', '--graph', '--merges',
      ];
      console.log(...cmd);
      console.log('');
      // For some reason async execFile always pipes stdout/err, we want it left alone for git colors.
      execFileSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
    }
  } catch (err) {
    console.error(err);
  }
};

main();
