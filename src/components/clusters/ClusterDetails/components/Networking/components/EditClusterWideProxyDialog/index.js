import { connect } from 'react-redux';
import { change, reduxForm, getFormMeta, formValueSelector } from 'redux-form';

import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { closeModal } from '~/components/common/Modal/ModalActions';
import { editCluster, clearClusterResponse } from '~/redux/actions/clustersActions';
import EditClusterWideProxyDialog from './EditClusterWideProxyDialog';
import { arrayToString, stringToArray } from '~/common/helpers';

const reduxFormConfig = {
  form: 'EditClusterWideProxy',
  enableReinitialize: true,
  touchOnChange: true,
  touchOnBlur: true,
};

const reduxFormEditCWProxy = reduxForm(reduxFormConfig)(EditClusterWideProxyDialog);

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;

  const valueSelector = formValueSelector('EditClusterWideProxy');
  const noUrlValues =
    !valueSelector(state, 'httpProxyUrl') && !valueSelector(state, 'httpsProxyUrl');
  const additionalTrustBundle =
    valueSelector(state, 'additionalTrustBundle') || cluster?.additional_trust_bundle;

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_WIDE_PROXY),
    initialValues: {
      clusterID: cluster.id,
      httpProxyUrl: cluster.proxy?.http_proxy,
      httpsProxyUrl: cluster.proxy?.https_proxy,
      noProxyDomains: stringToArray(cluster.proxy?.no_proxy),
    },
    additionalTrustBundle,
    editClusterProxyResponse: state.clusters.editedCluster,
    meta: getFormMeta('EditClusterWideProxy')(state),
    noUrlValues,
    noClusterProxyValues: noUrlValues && !additionalTrustBundle,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearClusterProxyResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  onSubmit: (formData) => {
    const clusterProxyBody = {
      proxy: {
        http_proxy: formData.httpProxyUrl,
        https_proxy: formData.httpsProxyUrl,
        no_proxy: arrayToString(formData.noProxyDomains),
      },
      additional_trust_bundle: formData.additionalTrustBundle,
    };
    dispatch(editCluster(formData.clusterID, clusterProxyBody));
  },
  sendError: () => {
    // 'invalid file' is a magic string that triggers a validation error
    // in src/common/validators.js validateCA function
    dispatch(change('EditClusterWideProxy', 'additional_trust_bundle', 'invalid file'));
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData);
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditCWProxy);
