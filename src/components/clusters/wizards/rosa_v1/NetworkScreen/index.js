import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';

import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { openModal } from '~/components/common/Modal/ModalActions';

import createOSDInitialValues from '../../common/createOSDInitialValues';

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
  const applicationIngress = valueSelector(state, 'applicationIngress');
  const machinePoolsSubnets = valueSelector(state, 'machinePoolsSubnets');

  return {
    cloudProviderID,
    isMultiAz,
    privateClusterSelected,
    configureProxySelected: valueSelector(state, 'configure_proxy'),
    selectedRegion,
    clusterVersionRawId: valueSelector(state, 'cluster_version.raw_id'),
    product,
    isByoc: isCCS,
    formValues,
    isHypershiftSelected,
    applicationIngress,
    initialValues: createOSDInitialValues({
      cloudProviderID,
      product,
      isMultiAz,
      isByoc: isCCS,
      isTrialDefault: ownProps.isTrialDefault,
      isHypershiftSelected,
      machinePoolsSubnets,
    }),
  };
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (modalName) => dispatch(openModal(modalName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(wizardConnector(NetworkScreen));
