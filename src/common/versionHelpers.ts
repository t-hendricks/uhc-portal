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

/**
 * Split version string to an array.
 *
 * @param version cluster version raw ID (i.e. "4.13.5")
 * @returns An array with destructuralized version [major, minor, patch, ...]
 */
export const splitVersion = (version: string): number[] => {
  let versionArray = [];
  try {
    versionArray = version.split('.').map((num) => parseInt(num, 10));
    versionArray[1] = versionArray[1] ?? 0;
  } catch (error) {
    return [];
  }
  return versionArray;
};

/**
 *
 * @param clusterVersionRawId A string, i.e. "4.15.5"
 * @param expectedMajor A number, i.e. "4"
 * @param expectedMinor A number
 * @returns True, if major and minor versions are equal
 */
export const isExactMajorMinor = (
  clusterVersionRawId: string,
  expectedMajor: number,
  expectedMinor: number,
): boolean => {
  const [major, minor] = splitVersion(clusterVersionRawId);
  return expectedMajor === major && expectedMinor === minor;
};

/**
 *
 * @param clusterVersionRawId A string, i.e. "4.15.5"
 * @param expectedMajor A number, i.e. "4"
 * @param expectedMinor A number
 * @returns True, if the version provided a raw ID string is equal or greater than the expected major.minor version
 */
export const isMajorMinorEqualOrGreater = (
  clusterVersionRawId: string,
  expectedMajor: number,
  expectedMinor: number,
): boolean => {
  const [major, minor] = splitVersion(clusterVersionRawId);
  return major > expectedMajor || (major === expectedMajor && minor >= expectedMinor);
};
