import { Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '../types/types';

type SecurityGroupForm = {
  applyControlPlaneToAll: boolean;
  controlPlane: string[];
  infra: string[];
  worker: string[];
};

const getDefaultSecurityGroupsSettings = () => ({
  // If "applyControlPlaneToAll" is true, the "controlPlane" SGs apply to all node types
  applyControlPlaneToAll: true,
  controlPlane: [],
  infra: [],
  worker: [],
});

const hasSelectedSecurityGroups = (securityGroups?: SecurityGroupForm) => {
  if (!securityGroups) {
    return false;
  }

  if (securityGroups.applyControlPlaneToAll) {
    return securityGroups.controlPlane.length > 0;
  }

  return (
    securityGroups.controlPlane.length > 0 ||
    securityGroups.infra.length > 0 ||
    securityGroups.worker.length > 0
  );
};

const hasSecurityGroupIds = (
  cluster: ClusterFromSubscription | Cluster = {},
  machinePools: MachinePool[] = [],
) => {
  if (
    (cluster?.aws?.additional_control_plane_security_group_ids ?? []).length > 0 ||
    (cluster?.aws?.additional_infra_security_group_ids ?? []).length > 0
  ) {
    return true;
  }
  return machinePools?.some((pool) => {
    if ((pool?.aws?.additional_security_group_ids ?? []).length > 0) {
      return true;
    }
    return false;
  });
};

export { getDefaultSecurityGroupsSettings, hasSelectedSecurityGroups, hasSecurityGroupIds };
