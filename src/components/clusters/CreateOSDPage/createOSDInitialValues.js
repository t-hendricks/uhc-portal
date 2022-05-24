import { normalizedProducts } from '../../../common/subscriptionTypes';

export const AWS_DEFAULT_REGION = 'us-east-1';
export const GCP_DEFAULT_REGION = 'us-east1';

const createOSDInitialValues = ({
  cloudProviderID = 'aws',
  product,
  isByoc,
  isMultiAz,
  isTrialDefault,
}) => {
  let defaultNodeCount;
  if (isByoc || isTrialDefault) {
    defaultNodeCount = isMultiAz ? 3 : 2;
  } else {
    defaultNodeCount = isMultiAz ? 9 : 4;
  }

  const initialValues = {
    cloud_provider: cloudProviderID,
    node_drain_grace_period: 60,
    upgrade_policy: 'manual',
    automatic_upgrade_schedule: '0 0 * * 0',
    multi_az: (!!isMultiAz).toString(),
    persistent_storage: '107374182400',
    load_balancers: '0',
    enable_user_workload_monitoring: 'true',
    nodes_compute: defaultNodeCount,
    node_labels: [{}],
    byoc: (!!isByoc || !!isTrialDefault).toString(),
    name: '',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    network_configuration_toggle: 'basic',
    cluster_privacy: 'external',
    disable_scp_checks: false,
    billing_model: isTrialDefault ? 'standard-trial' : 'standard',
    product: product || (isTrialDefault ? normalizedProducts.OSDTrial : normalizedProducts.OSD),
  };

  if (cloudProviderID) {
    initialValues.region = cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  }

  return initialValues;
};

export default createOSDInitialValues;
