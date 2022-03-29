#!/usr/bin/env node

import fetch from 'node-fetch';
import ProgressBar from 'progress';

import { getFlatUrls } from '../src/common/installLinks.mjs';

const urls = await getFlatUrls();
const statusByUrl = {};
const bar = new ProgressBar(':bar', { total: urls.length, clear: true });

await Promise.all(urls.map(async (url) => {
  if (url.startsWith('mailto:')) {
    statusByUrl[url] = 'not checked'
  } else {
    try {
      // Redirects are interesting because (1) for permanent redirect we might want to update
      // (2) sometimes they're effectively 404 not-found-so-redirecting-to-docs-index :-(
      const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
      statusByUrl[url] = response.status;
      if (response.status >= 300 && response.status < 400) {
        const locationURL = new URL(response.headers.get('location'), response.url);
        statusByUrl[url] = `${response.status} ->\t${locationURL}`;
      }
    } catch (e) {
      // 3xx-5xx are NOT exceptions, but networks errors etc. are.
      // Stuffing the exception here will slightly mess up the tabular output, but the details are useful.
      statusByUrl[url] = e.toString();
    }
  }
  bar.tick();
}));

let countGood = 0;
urls.forEach(url => {
  const status = statusByUrl[url];
  if (status !== 200) {
    console.log(`${url}\t${status}`);
  } else {
    countGood++;
  }
});
console.log(`...${countGood} URLs...\t200`)
