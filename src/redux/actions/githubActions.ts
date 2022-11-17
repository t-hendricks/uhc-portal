import { action, ActionType } from 'typesafe-actions';
import githubService from '../../services/githubService';

export const GITHUB_GET_LATEST_RELEASE = 'GITHUB_GET_LATEST_RELEASE';

export const getLatestRelease = (repo: string) =>
  action(GITHUB_GET_LATEST_RELEASE, githubService.getLatestRelease(repo), { repo });

type GithubActions = ActionType<typeof getLatestRelease>;

export { GithubActions };
