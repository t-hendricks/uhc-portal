import semver from 'semver';
import isEmpty from 'lodash/isEmpty';

// example link: https://docs.openshift.com/container-platform/4.8/updating/updating-cluster-between-minor.html#candidate-4-8-channel
const getCandidateChannelLink = (version) => {
  const parsed = semver.coerce(version);

  if (!parsed) {
    return null;
  }

  const {
    major,
    minor,
    prerelease,
  } = parsed;

  if (major !== 4 || !isEmpty(prerelease)) {
    return null;
  }

  return `https://docs.openshift.com/container-platform/${major}.${minor}/updating/updating-cluster-between-minor.html#candidate-${major}-${minor}-channel`;
};

export default getCandidateChannelLink;
