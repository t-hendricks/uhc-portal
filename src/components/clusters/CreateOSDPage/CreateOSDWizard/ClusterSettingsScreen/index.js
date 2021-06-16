import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import canEnableEtcdSelector from '../../CreateOsdPageSelectors';

import wizardConnector from '../WizardConnector';
import ClusterSettingsScreen from './ClusterSettingsScreen';

const AWS_DEFAULT_REGION = 'us-east-1';
const GCP_DEFAULT_REGION = 'us-east1';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const isAutomaticUpgrade = valueSelector(state, 'upgrade_policy') === 'automatic';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billingModel');
  const customerManagedEncryptionSelected = valueSelector(state, 'customer_managed_key');
  const selectedRegion = valueSelector(state, 'region');

  return {
    cloudProviderID,
    isMultiAz,
    product,
    billingModel,
    isByoc,
    isAutomaticUpgrade,
    canEnableEtcdEncryption: canEnableEtcdSelector(state),
    customerManagedEncryptionSelected,
    selectedRegion,
    initialValues: {
      region: cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION,
      node_drain_grace_period: 60,
      upgrade_policy: 'manual',
      automatic_upgrade_schedule: '0 0 * * 0',
      multi_az: 'false',
      persistent_storage: '107374182400',
      load_balancers: '0',
      enable_user_workload_monitoring: 'true',
    },
  };
};

export default connect(mapStateToProps)(wizardConnector(ClusterSettingsScreen));
