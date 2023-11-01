import { connect } from 'react-redux';
import { change, reduxForm, getFormMeta, formValueSelector } from 'redux-form';

import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { closeModal } from '~/components/common/Modal/ModalActions';
import { editCluster, clearClusterResponse } from '~/redux/actions/clustersActions';
import { arrayToString, stringToArray } from '~/common/helpers';
import EditClusterWideProxyDialog from './EditClusterWideProxyDialog';

const reduxFormConfig = {
  form: 'EditClusterWideProxy',
  enableReinitialize: true,
  touchOnChange: true,
  touchOnBlur: true,
};

const reduxFormEditCWProxy = reduxForm(reduxFormConfig)(EditClusterWideProxyDialog);
// Helper function to check if values have changed, returns changed value or undefined
const OnlyRetunValueIfChanged = (newValue, oldValue) =>
  newValue !== oldValue ? newValue : undefined;

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
  onSubmit: (formData, prevValues) => {
    const clusterProxyBody = {
      proxy: {
        http_proxy: OnlyRetunValueIfChanged(formData.http_proxy_url, prevValues.http_proxy_url),
        https_proxy: OnlyRetunValueIfChanged(formData.https_proxy_url, prevValues.https_proxy_url),
        no_proxy: OnlyRetunValueIfChanged(
          arrayToString(formData.no_proxy_domains),
          arrayToString(prevValues.no_proxy_domains),
        ),
      },
      additional_trust_bundle: OnlyRetunValueIfChanged(
        formData.additional_trust_bundle,
        prevValues.additional_trust_bundle,
      ),
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
    dispatchProps.onSubmit(formData, stateProps.initialValues);
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditCWProxy);
