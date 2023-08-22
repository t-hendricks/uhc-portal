import { isRestrictedEnv } from '~/restrictedEnv';
import { defaultWorkerNodeVolumeSizeGiB } from '~/components/clusters/wizards/rosa/constants';
import { getDefaultClusterAutoScaling } from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';
import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';
import { IMDSType } from '../wizards/common';

export const AWS_DEFAULT_REGION = 'us-east-1';
export const GCP_DEFAULT_REGION = 'us-east1';
const newEmptySubnet = () => ({ subnet_id: '', availability_zone: '' });

const createOSDInitialValues = ({
  cloudProviderID = 'aws',
  product,
  isByoc,
  isMultiAz,
  isTrialDefault,
  isHypershiftSelected,
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
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
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

    applicationIngress: 'default',
    defaultRouterSelectors: '',
    defaultRouterExcludedNamespacesFlag: '',
    isDefaultRouterWildcardPolicyAllowed: false,
    isDefaultRouterNamespaceOwnershipPolicyStrict: true,

    // Optional fields based on whether Hypershift is selected or not
    ...(isHypershiftSelected
      ? {
          selected_vpc_id: '',
          machine_pools_subnets: [newEmptySubnet()],
          cluster_privacy_public_subnet: newEmptySubnet(),
          worker_volume_size_gib: undefined,
        }
      : {
          enable_user_workload_monitoring: 'true',
          worker_volume_size_gib: defaultWorkerNodeVolumeSizeGiB,
        }),
  };

  if (cloudProviderID) {
    initialValues.region = cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  }

  return initialValues;
};

export default createOSDInitialValues;
