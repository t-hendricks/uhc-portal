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
    !valueSelector(state, 'http_proxy_url') && !valueSelector(state, 'https_proxy_url');
  const additionalTrustBundle =
    valueSelector(state, 'additional_trust_bundle') || cluster?.additional_trust_bundle;

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_WIDE_PROXY),
    initialValues: {
      clusterID: cluster.id,
      http_proxy_url: cluster.proxy?.http_proxy,
      https_proxy_url: cluster.proxy?.https_proxy,
      no_proxy_domains: stringToArray(cluster.proxy?.no_proxy),
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
        http_proxy: formData.http_proxy_url,
        https_proxy: formData.https_proxy_url,
        no_proxy: arrayToString(formData.no_proxy_domains),
      },
      additional_trust_bundle: formData.additional_trust_bundle,
    };
    dispatch(editCluster(formData.clusterID, clusterProxyBody));
  },
  sendError: () => {
    // 'Invalid file' is a magic string that triggers a validation error
    // in src/common/validators.js validateCA function
    dispatch(change('EditClusterWideProxy', 'additional_trust_bundle', 'Invalid file'));
  },
  change,
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
