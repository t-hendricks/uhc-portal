import semver from 'semver';
import isEmpty from 'lodash/isEmpty';

// example link: https://docs.openshift.com/container-platform/4.2/release_notes/ocp-4-2-release-notes.html#ocp-4-2-4
const getReleaseNotesLink = (version) => {
  const parsed = semver.coerce(version);

  if (!parsed) {
    return null;
  }

  const { major, minor, patch, prerelease } = parsed;

  if (major !== 4 || !isEmpty(prerelease)) {
    return null;
  }

  const pageURL = `https://docs.openshift.com/container-platform/${major}.${minor}/release_notes/ocp-${major}-${minor}-release-notes.html`;
  const patchAnchor = `#ocp-${major}-${minor}-${patch}`;

  if (patch > 0) {
    return pageURL + patchAnchor;
  }

  return pageURL;
};

export default getReleaseNotesLink;
