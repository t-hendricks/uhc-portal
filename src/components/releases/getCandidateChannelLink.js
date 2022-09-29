import semver from 'semver';
import isEmpty from 'lodash/isEmpty';

// example link: https://docs.openshift.com/container-platform/4.8/updating/updating-cluster-within-minor.html#candidate-4-8-channel
const getCandidateChannelLink = (version) => {
  const parsed = semver.coerce(version);

  if (!parsed) {
    return null;
  }

  const { major, minor, prerelease } = parsed;

  if (major !== 4 || !isEmpty(prerelease)) {
    return null;
  }

  // docs changed the URL with 4.6+
  const filename =
    minor < 6
      ? `updating-cluster-between-minor.html#candidate-${major}-${minor}-channel`
      : 'understanding-upgrade-channels-release.html#candidate-version-channel_understanding-upgrade-channels-releases';

  return `https://docs.openshift.com/container-platform/${major}.${minor}/updating/${filename}`;
};

export default getCandidateChannelLink;
