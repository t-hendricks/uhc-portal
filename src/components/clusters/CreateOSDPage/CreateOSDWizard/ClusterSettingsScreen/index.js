import { connect } from 'react-redux';
import { formValueSelector, getFormSyncErrors, getFormAsyncErrors, touch } from 'redux-form';

import createOSDInitialValues from '../../createOSDInitialValues';

import wizardConnector from '../WizardConnector';
import ClusterSettingsScreen from './ClusterSettingsScreen';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billing_model');
  const customerManagedEncryptionSelected = valueSelector(state, 'customer_managed_key');
  const selectedRegion = valueSelector(state, 'region');
  const kmsKeyArn = valueSelector(state, 'kms_key_arn');
  const etcdKeyArn = valueSelector(state, 'etcd_key_arn');
  const isEtcdEncryptionSelected = valueSelector(state, 'etcd_encryption');
  const isFipsCryptoSelected = valueSelector(state, 'fips');

  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';
  const formErrors = {
    ...getFormSyncErrors('CreateCluster')(state),
    ...getFormAsyncErrors('CreateCluster')(state),
  };

  return {
    cloudProviderID,
    isMultiAz,
    product,
    billingModel,
    isByoc,
    customerManagedEncryptionSelected,
    selectedRegion,
    kmsKeyArn,
    etcdKeyArn,
    isEtcdEncryptionSelected,
    isFipsCryptoSelected,
    isHypershiftSelected,
    formErrors,
    touch: (fieldNames) => touch('CreateCluster', ...fieldNames),
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isMultiAz,
      isByoc,
      isTrialDefault: ownProps.isTrialDefault,
    }),
  };
};

export default connect(mapStateToProps)(wizardConnector(ClusterSettingsScreen));
