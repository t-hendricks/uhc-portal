import { connect } from 'react-redux';
import { formValueSelector, getFormValues, touch } from 'redux-form';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import createOSDInitialValues from '~/components/clusters/wizards/rosa_v1/createOSDInitialValues';

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
  const machinePoolsSubnets = valueSelector(state, 'machinePoolsSubnets');

  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  return {
    formValues: getFormValues('CreateCluster')(state),
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
    touch: (fieldNames) => touch('CreateCluster', ...fieldNames),
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isMultiAz,
      isByoc,
      isTrialDefault: ownProps.isTrialDefault,
      machinePoolsSubnets,
    }),
  };
};

export default connect(mapStateToProps)(wizardConnector(ClusterSettingsScreen));
