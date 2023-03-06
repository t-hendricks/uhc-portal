// expected format to be "openshift-vA.B.C(-suffix)"
export const versionRegEx = /^.*[v-]([0-9\\.]+).*$/;

export const versionFormatter = (version: string): string => version.replace(versionRegEx, '$1');
