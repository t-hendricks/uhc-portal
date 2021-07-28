import githubService from '../../services/githubService';

export const GITHUB_GET_LATEST_RELEASE = 'GITHUB_GET_LATEST_RELEASE';

export const getLatestRelease = repo => ({
  type: GITHUB_GET_LATEST_RELEASE,
  meta: { repo },
  payload: githubService.getLatestRelease(repo),
});
