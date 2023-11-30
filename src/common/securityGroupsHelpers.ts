type SecurityGroupForm = {
  applyControlPlaneToAll: boolean;
  controlPlane: string[];
  infra: string[];
  worker: string[];
};

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

export { hasSelectedSecurityGroups };
