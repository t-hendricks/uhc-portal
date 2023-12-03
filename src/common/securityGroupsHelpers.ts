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

export { hasSelectedSecurityGroups, getDefaultSecurityGroupsSettings };
