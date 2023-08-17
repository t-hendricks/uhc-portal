import semver from 'semver';

const versionRegExp = /^.*(v[0-9]+.*)$/;

/**
 * Formats a version for display
 * @param version expected format (openshift-)vA.B.C(-suffix1)(-suffix2)
 * @returns a simplified display of the version. For the part after the version, extracts the first string
 *  example:
 *  - openshift-v4.12.0-candidate --> 4.12.0-candidate
 */
export const versionFormatter = (version: string): string => {
  const rawVersion = semver.coerce(version);
  if (!rawVersion) {
    return version;
  }
  const baseVersion = version.replace(versionRegExp, '$1');
  const prerelease = semver.prerelease(baseVersion) || [];

  const textTokens = prerelease.find((item): item is string => typeof item === 'string');
  return `${rawVersion.raw}${textTokens ? `-${textTokens.split('-')[0]}` : ''}`;
};

export const splitMajorMinor = (version: string): number[] => {
  let versionArray = [];
  try {
    versionArray = version.split('.').map((num) => parseInt(num, 10));
  } catch (error) {
    return [];
  }
  return versionArray;
};
