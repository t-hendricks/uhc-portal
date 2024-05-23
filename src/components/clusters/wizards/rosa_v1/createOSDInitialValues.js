import { getDefaultSecurityGroupsSettings } from '~/common/securityGroupsHelpers';
import { getDefaultClusterAutoScaling } from '~/components/clusters/common/clusterAutoScalingValues';
import { defaultWorkerNodeVolumeSizeGiB } from '~/components/clusters/wizards/rosa/constants';
import { isRestrictedEnv } from '~/restrictedEnv';

import { billingModels, normalizedProducts } from '../../../../common/subscriptionTypes';
import { IMDSType } from '../common/constants';

export const AWS_DEFAULT_REGION = 'us-east-1';

export const emptyAWSSubnet = () => ({
  availabilityZone: '',
  privateSubnetId: '',
  publicSubnetId: '',
});

const createOSDInitialValues = ({
  cloudProviderID = 'aws',
  product,
  isByoc,
  isMultiAz,
  isTrialDefault,
  isHypershiftSelected = false,
  machinePoolsSubnets,
}) => {
  let defaultNodeCount;
  if (isByoc || isTrialDefault) {
    defaultNodeCount = isMultiAz ? 3 : 2;
  } else {
    defaultNodeCount = isMultiAz ? 9 : 4;
  }

  const clusterAutoScaling =
    cloudProviderID === 'aws' && !isHypershiftSelected ? getDefaultClusterAutoScaling() : {};

  const billingModelValue = () => {
    if (isTrialDefault) {
      return billingModels.STANDARD_TRIAL;
    }
    if (isHypershiftSelected) {
      return billingModels.MARKETPLACE_AWS;
    }
    return billingModels.STANDARD;
  };

  const initialValues = {
    cloud_provider: cloudProviderID,
    node_drain_grace_period: 60,
    upgrade_policy: isHypershiftSelected ? 'automatic' : 'manual',
    automatic_upgrade_schedule: '0 0 * * 0',
    multi_az: (!!isMultiAz).toString(),
    persistent_storage: '107374182400',
    load_balancers: '0',
    nodes_compute: defaultNodeCount,
    node_labels: [{}],
    byoc: (!!isByoc || !!isTrialDefault).toString(),
    name: '',
    network_configuration_toggle: 'basic',
    cluster_privacy: isRestrictedEnv() ? 'internal' : 'external',
    install_to_vpc: isHypershiftSelected,
    use_privatelink: false,
    configure_proxy: false,
    disable_scp_checks: false,
    billing_model: billingModelValue(),
    cluster_autoscaling: clusterAutoScaling,
    product: product || (isTrialDefault ? normalizedProducts.OSDTrial : normalizedProducts.OSD),
    imds: IMDSType.V1AndV2,
    etcd_encryption: !!isRestrictedEnv(),
    fips: !!isRestrictedEnv(),

    applicationIngress: 'default',
    defaultRouterSelectors: '',
    defaultRouterExcludedNamespacesFlag: '',
    isDefaultRouterWildcardPolicyAllowed: false,
    isDefaultRouterNamespaceOwnershipPolicyStrict: true,
    selected_vpc: {
      id: '',
      name: '',
    },
    machinePoolsSubnets: machinePoolsSubnets ?? [emptyAWSSubnet()],

    // Optional fields based on whether Hypershift is selected or not
    ...(isHypershiftSelected
      ? {
          cluster_privacy_public_subnet_id: '',
          worker_volume_size_gib: undefined,
          shared_vpc: { is_allowed: false },
        }
      : {
          securityGroups: getDefaultSecurityGroupsSettings(),
          enable_user_workload_monitoring: 'true',
          worker_volume_size_gib: defaultWorkerNodeVolumeSizeGiB,
          shared_vpc: {
            is_allowed: true,
            is_selected: false,
            base_dns_domain: '',
            hosted_zone_id: '',
            hosted_zone_role_arn: '',
          },
        }),
  };

  if (cloudProviderID) {
    initialValues.region = AWS_DEFAULT_REGION;
  }

  return initialValues;
};

export default createOSDInitialValues;
