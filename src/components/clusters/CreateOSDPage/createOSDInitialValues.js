import { normalizedProducts } from '../../../common/subscriptionTypes';

const createOSDInitialValues = ({ cloudProviderID, isByoc, isMultiAz }) => {
  let defaultNodeCount;
  if (isByoc) {
    defaultNodeCount = isMultiAz ? 3 : 2;
  } else {
    defaultNodeCount = isMultiAz ? 9 : 4;
  }

  const AWS_DEFAULT_REGION = 'us-east-1';
  const GCP_DEFAULT_REGION = 'us-east1';
  const initialValues = {
    node_drain_grace_period: 60,
    upgrade_policy: 'manual',
    automatic_upgrade_schedule: '0 0 * * 0',
    multi_az: (!!isMultiAz).toString(),
    persistent_storage: '107374182400',
    load_balancers: '0',
    enable_user_workload_monitoring: 'true',
    nodes_compute: defaultNodeCount,
    node_labels: [{}],
    byoc: (!!isByoc).toString(),
    name: '',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    network_configuration_toggle: 'basic',
    disable_scp_checks: false,
    billing_model: 'standard',
    product: normalizedProducts.OSD,
  };
  if (cloudProviderID) {
    initialValues.region = cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  }

  return initialValues;
};

export default createOSDInitialValues;
