#!/usr/bin/env node

import os from 'os';
import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';
import { simpleGit } from 'simple-git';

const upstreamRepoPattern = /.*gitlab\.cee\.redhat\.com[:/]service\/uhc-portal.*/;

export async function getUpstreamRemoteName(git) {
  const str = (await git.remote(['-v'])) || '';
  const lines = str.trim().split(os.EOL);
  const remotes = {};
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = /([^(]+)\((push|fetch)\)/.exec(line);
    if (match) {
      const segs = match[1].trim().split('\t');
      // eslint-disable-next-line prefer-destructuring
      remotes[segs[0]] = segs[1];
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const remoteName of Object.keys(remotes)) {
    if (remotes[remoteName].match(upstreamRepoPattern)) {
      return remoteName;
    }
  }
  return 'upstream';
}

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const git = simpleGit(process.cwd());
  console.log(await getUpstreamRemoteName(git));
}
