import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';

import createOSDInitialValues from '../../createOSDInitialValues';

import wizardConnector from '../WizardConnector';
import NetworkScreen from './NetworkScreen';

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('CreateCluster');

  const cloudProviderID = valueSelector(state, 'cloud_provider');
  const product = valueSelector(state, 'product');
  const isCCS = valueSelector(state, 'byoc') === 'true';
  const isMultiAz = valueSelector(state, 'multi_az') === 'true';
  const privateClusterSelected = valueSelector(state, 'cluster_privacy') === 'internal';
  const selectedRegion = valueSelector(state, 'region');
  const formValues = getFormValues('CreateCluster')(state);
  // hosted ROSA cluster
  const isHypershiftSelected = valueSelector(state, 'hypershift') === 'true';

  return {
    cloudProviderID,
    isMultiAz,
    privateClusterSelected,
    configureProxySelected: valueSelector(state, 'configure_proxy'),
    selectedRegion,
    product,
    isByoc: isCCS,
    formValues,
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isMultiAz,
      isByoc: isCCS,
      isTrialDefault: ownProps.isTrialDefault,
      isHypershiftSelected,
    }),
  };
};

export default connect(mapStateToProps)(wizardConnector(NetworkScreen));
