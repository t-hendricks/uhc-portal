import uniq from 'lodash/uniq';

const createClusterAzs = ({ formData, isInstallExistingVPC }) => {
  let AZs = [];
  if (formData.hypershift === 'true') {
    AZs = uniq(formData.machine_pools_subnets.map((subnet) => subnet.availability_zone));
  } else if (isInstallExistingVPC) {
    AZs.push(formData.az_0);
    if (formData.multi_az === 'true') {
      AZs.push(formData.az_1, formData.az_2);
    }
  } else {
    // The backend does not admit an empty list of availability_zones
    return undefined;
  }
  return AZs;
};

const createClusterAwsSubnetIds = ({ formData, isInstallExistingVPC }) => {
  const subnetIds = [];

  if (formData.hypershift === 'true') {
    if (formData.cluster_privacy === 'external') {
      subnetIds.push(formData.cluster_privacy_public_subnet.subnet_id);
    }
    const privateSubnetIds = formData.machine_pools_subnets.map((subnet) => subnet.subnet_id);
    subnetIds.push(...privateSubnetIds);
  } else if (isInstallExistingVPC) {
    const showPublicFields = !formData.use_privatelink;

    subnetIds.push(formData.private_subnet_id_0);
    if (showPublicFields) {
      subnetIds.push(formData.public_subnet_id_0);
    }

    const isMultiAz = formData.multi_az === 'true';
    if (isMultiAz) {
      subnetIds.push(formData.private_subnet_id_1, formData.private_subnet_id_2);
      if (showPublicFields) {
        subnetIds.push(formData.public_subnet_id_1, formData.public_subnet_id_2);
      }
    }
  }
  return subnetIds.filter((sn) => !!sn);
};

const createSecurityGroupsParams = (securityGroups) => {
  if (!securityGroups) {
    return undefined;
  }
  const { applyControlPlaneToAll, controlPlane, infra, worker } = securityGroups;

  if (applyControlPlaneToAll && controlPlane.length > 0) {
    return {
      additional_control_plane_security_group_ids: controlPlane,
      additional_infra_security_group_ids: controlPlane,
      additional_compute_security_group_ids: controlPlane,
    };
  }

  const params = {};
  if (controlPlane.length > 0) {
    params.additional_control_plane_security_group_ids = controlPlane;
  }
  if (securityGroups.infra.length > 0) {
    params.additional_infra_security_group_ids = infra;
  }
  if (securityGroups.worker.length > 0) {
    params.additional_compute_security_group_ids = worker;
  }
  return Object.keys(params).length === 0 ? undefined : params;
};

export { createClusterAzs, createClusterAwsSubnetIds, createSecurityGroupsParams };
