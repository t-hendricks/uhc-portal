import isEmpty from 'lodash/isEmpty';
import semver from 'semver';

// example link: https://docs.openshift.com/container-platform/4.8/updating/updating-cluster-within-minor.html#candidate-4-8-channel
const getCandidateChannelLink = (version: string | undefined): string | null => {
  const parsed = semver.coerce(version);

  if (!parsed) {
    return null;
  }

  const { major, minor, prerelease } = parsed;

  if (major !== 4 || !isEmpty(prerelease)) {
    return null;
  }

  let filename = 'understanding_updates/understanding-update-channels-release.html';
  // docs changed the URL with 4.14+
  if (minor < 14) {
    // docs changed the URL with 4.6+
    if (minor < 6) {
      filename = `updating-cluster-between-minor.html#candidate-${major}-${minor}-channel`;
    } else {
      filename =
        'understanding-upgrade-channels-release.html#candidate-version-channel_understanding-upgrade-channels-releases';
    }
  }

  return `https://docs.openshift.com/container-platform/${major}.${minor}/updating/${filename}`;
};

export default getCandidateChannelLink;
