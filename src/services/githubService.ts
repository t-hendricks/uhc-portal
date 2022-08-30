// Unauthenticated GitHub API.
//
// May be rejected for rate limit (60/hour per IP):
// https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting

import axios from 'axios';

/** Given a repo like 'redhat-developer/app-services-cli', return latest release info. */
const getLatestRelease = repo => (
  axios.get(`https://api.github.com/repos/${repo}/releases/latest`)
);

export default {
  getLatestRelease,
};
