#!/usr/bin/env node
import util from 'util';
import { execFile, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

import listGitRemotes from 'list-git-remotes';
import JSON5 from 'json5';
import { quote } from 'shell-quote'; // only to be used for logging
import yargs from 'yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execFilePromise = util.promisify(execFile);
const listGitRemotesPromise = util.promisify(listGitRemotes);

const flags = yargs
  .option('json', { description: 'Output detailed JSON.' })
  .option('short', { description: 'Output name & hash summary.' })
  .option('set-git-branches', { description: 'Create/update git branches.' })
  .option('git-graph', { description: 'Show git graph. Implies --set-git-branches.' })
  .version(false)
  .help(true)
  .argv;

const getUpstreamRemote = async () => {
  const remoteUrls = await listGitRemotesPromise(__dirname);
  for (const remoteName of Object.keys(remoteUrls)) {
    if (remoteUrls[remoteName].match('.*gitlab\\.cee\\.redhat\\.com[:/]service/uhc-portal.*')) {
      return remoteName;
    }
  }
  throw 'missing remote for uhc-portal repo';
};

const getAssistedUILibVersion = async (revision) => {
  const r = await execFilePromise('git', ['cat-file', 'blob', `${revision}:package.json`]);
  return JSON.parse(r.stdout).dependencies['openshift-assisted-ui-lib'];
};

// Helpers returning a promise, should resolve to an object containing *at least* .src_hash.

const gitBranch = async (branch) => {
  try {
    // this hash-parsing should match the implementation at /push_to_insights.sh
    const r = await execFilePromise('git', ['rev-parse', '--short', branch]);
    return { src_hash: r.stdout.trimRight() };
  } catch (err) {
    return { ERROR: err };
  }
};

// app.info.json files generated in push_to_insights.sh & insights-Jenkinsfile
const appInfo = async (url) => {
  const r = await execFilePromise('curl', ['--silent', '--show-error', '--fail-with-body', url]);
  try {
    // Some contain a trailing comma, making it invalid JSON, so use JSON5.
    return JSON5.parse(r.stdout);
  } catch (err) {
    return { ERROR: `${err} - ${r.stdout}` };
  }
};

const getEnvs = async (upstream) => {
  const envs = [
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
    // eslint-disable-next-line no-param-reassign
    e.info = await e.info;
    if (e.info.src_hash) {
      e.info.assisted_ui_lib_version = await getAssistedUILibVersion(e.info.src_hash);
    }
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
    await execFilePromise('git', ['fetch', upstream]);
    const envs = await getEnvs(upstream);

    if (flags.json) {
      console.log(JSON.stringify(envs, null, 2));
    }

    const widestName = Math.max(...envs.map(e => e.name.length));
    const widestHash = Math.max(...envs.map(e => e.info.src_hash.length));

    if (flags.short) {
      envs.forEach((e) => {
        const paddedName = e.name.padStart(widestName, ' ');
        const paddedHash = e.info.src_hash.padEnd(widestHash, ' ');
        console.log(`${paddedName} ${paddedHash}  [assited-ui ${e.info.assisted_ui_lib_version}]`);
      });
    }

    if (flags.setGitBranches || flags.gitGraph) {
      // I do want a sequential loop, can't use forEach.
      // eslint-disable-next-line no-restricted-syntax
      for (const e of envs) {
        const paddedName = e.name.padStart(widestName, ' ');
        const paddedHash = e.info.src_hash.padEnd(widestHash, ' ');
        // Don't try overwriting branches taken from git like `upstream/master`
        // (would probably be a no-op but safer not to).
        if (e.name.match('build_pushed_.*|live_.*') && e.info.src_hash) {
          const cmd = ['git', 'branch', '--force', e.name, e.info.src_hash];
          console.log(`git branch --force ${paddedName} ${paddedHash}  # [assited-ui ${e.info.assisted_ui_lib_version}]`);
          await execFilePromise(cmd[0], cmd.slice(1), { stdio: 'inherit' });
        } else {
          console.log(`#                  ${paddedName} ${paddedHash}    [assited-ui ${e.info.assisted_ui_lib_version}]`);
        }
      }
    }

    if (flags.gitGraph) {
      const cmd = [
        'env', 'GIT_PAGER=', 'git', 'log', ...envs.map(e => e.name),
        // Limit graph scope by omitting everything including 2 prod deploys ago.
        '--not', 'live_stable~2', '--graph',
        // Only MR merges, skip internal merge commit done while working on MR content.
        '--extended-regexp', "--grep=Merge branch '[^']+' into '(master|candidate.*|stable)'|[Cc]herry",
        // %C: color, %h: hash, %d: (decorations).
        // %s subject "Merge branch ...", start %b body on same line to conserve vertical space.
        // %w: indents following lines of body.
        '--pretty=%C(auto)%cs %H%d %C(dim)%s — %C(auto)%w(0,0,10)%b',
        '--color=always',
      ];
      console.log(quote(cmd));
      console.log('');
      execFileSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
    }
  } catch (err) {
    console.error(err);
  }
};

main();
