import { isMajorMinorEqualOrGreater } from '~/common/versionHelpers';

/* When changing, consider updating the COnfiguration and NetworkScreen components as well (they contain 4.13-specific logic */
export const canConfigureDayTwoManagedIngress = (clusterVersionRawId: string): boolean =>
  isMajorMinorEqualOrGreater(clusterVersionRawId, 4, 13);

export const canConfigureLoadBalancer = (
  clusterVersionRawId: string,
  isSTSEnabled: boolean,
): boolean => !isSTSEnabled || canConfigureDayTwoManagedIngress(clusterVersionRawId);
