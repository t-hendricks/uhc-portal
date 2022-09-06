export const versionRegEx =
  /(?<major>\d+).(?<minor>\d+).(?<revision>\d+)(?:-(rc|fc).(?<patch>\d+))?/;

export const versionComparator = (v1, v2) => {
  const { groups: g1 } = versionRegEx.exec(v1);
  const { groups: g2 } = versionRegEx.exec(v2);
  if (g1.major !== g2.major) {
    return parseInt(g1.major, 10) > parseInt(g2.major, 10) ? 1 : -1;
  }
  if (g1.minor !== g2.minor) {
    return parseInt(g1.minor, 10) > parseInt(g2.minor, 10) ? 1 : -1;
  }
  if (g1.revision !== g2.revision) {
    return parseInt(g1.revision, 10) > parseInt(g2.revision, 10) ? 1 : -1;
  }
  if (g1.patch !== g2.patch) {
    // e.g. 4.6.0 is later than 4.6.0-rc.4
    if (g1.patch === undefined) {
      return 1;
    }
    if (g2.patch === undefined) {
      return -1;
    }
    return parseInt(g1.patch, 10) > parseInt(g2.patch, 10) ? 1 : -1;
  }
  return 0;
};
