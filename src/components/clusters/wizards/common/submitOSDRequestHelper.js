import uniq from 'lodash/uniq';

// OSD and ROSA form data is different - will be the same when subnet dropdowns are added to OSD
const createClusterAzs = ({ formData, isInstallExistingVPC, actualProduct }) => {
  let AZs = [];
  if (formData.hypershift === 'true') {
    const selectedVpc = formData.selected_vpc;
    formData.machinePoolsSubnets.forEach((formSubnet) => {
      const subnetInfo = selectedVpc.aws_subnets?.find(
        (vpcSubnet) => vpcSubnet.subnet_id === formSubnet.privateSubnetId,
      );
      if (subnetInfo) {
        AZs.push(subnetInfo.availability_zone);
      }
    });
  } else if (actualProduct === 'ROSA' && isInstallExistingVPC) {
    AZs = formData.machinePoolsSubnets.map((subnet) => subnet.availabilityZone);
  } else if (isInstallExistingVPC) {
    // OSD
    AZs.push(formData.az_0);
    if (formData.multi_az === 'true') {
      AZs.push(formData.az_1, formData.az_2);
    }
  }
  // The backend does not accept an empty list of availability_zones
  return AZs.length === 0 ? undefined : uniq(AZs);
};

// OSD and ROSA form data is different - will be the same when subnet dropdowns are added to OSD
const createClusterAwsSubnetIds = ({ formData, isInstallExistingVPC, actualProduct }) => {
  const subnetIds = [];

  const { machinePoolsSubnets: mpSubnets } = formData;

  if (formData.hypershift === 'true') {
    if (formData.cluster_privacy === 'external') {
      subnetIds.push(formData.cluster_privacy_public_subnet_id);
    }
    const privateSubnetIds = mpSubnets.map((subnet) => subnet.privateSubnetId);
    subnetIds.push(...privateSubnetIds);
  } else if (actualProduct === 'ROSA' && isInstallExistingVPC) {
    const hasPublicSubnets = !formData.use_privatelink;

    subnetIds.push(mpSubnets[0].privateSubnetId);
    if (hasPublicSubnets) {
      subnetIds.push(mpSubnets[0].publicSubnetId);
    }

    const isMultiAz = formData.multi_az === 'true';
    if (isMultiAz) {
      subnetIds.push(mpSubnets[1].privateSubnetId, mpSubnets[2].privateSubnetId);
      if (hasPublicSubnets) {
        subnetIds.push(mpSubnets[1].publicSubnetId, mpSubnets[2].publicSubnetId);
      }
    }
  } else if (isInstallExistingVPC) {
    // OSD
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
