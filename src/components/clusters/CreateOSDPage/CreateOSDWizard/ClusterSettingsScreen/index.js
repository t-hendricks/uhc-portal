import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import canEnableEtcdSelector from '../../CreateOsdPageSelectors';

import createOSDInitialValues from '../../createOSDInitialValues';

import wizardConnector from '../WizardConnector';
import ClusterSettingsScreen from './ClusterSettingsScreen';

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const isAutomaticUpgrade = valueSelector(state, 'upgrade_policy') === 'automatic';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
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
    initialValues: createOSDInitialValues({ cloudProviderID, isMultiAz, isByoc }),
  };
};

export default connect(mapStateToProps)(wizardConnector(ClusterSettingsScreen));
