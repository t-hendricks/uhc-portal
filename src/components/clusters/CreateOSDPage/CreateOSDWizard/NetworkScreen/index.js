import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import createOSDInitialValues from '../../createOSDInitialValues';

import wizardConnector from '../WizardConnector';
import NetworkScreen from './NetworkScreen';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const isByoc = valueSelector(state, 'byoc') === 'true';
  const privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';
  const product = valueSelector(state, 'product');
  const billingModel = valueSelector(state, 'billingModel');
  const selectedRegion = valueSelector(state, 'region');
  const networkingMode = valueSelector(state, 'network_configuration_toggle');

  return {
    cloudProviderID,
    isMultiAz,
    privateClusterSelected,
    product,
    billingModel,
    isCCS: isByoc,
    selectedRegion,
    networkingMode,
    initialValues: createOSDInitialValues({
      cloudProviderID, isMultiAz, isByoc, isTrialDefault: ownProps.isTrialDefault,
    }),
  };
};

export default connect(mapStateToProps)(wizardConnector(NetworkScreen));
