import { connect } from 'react-redux';
import {
  change, reduxForm, getFormMeta,
} from 'redux-form';
import modals from '../../../../../../../common/Modal/modals';
import shouldShowModal from '../../../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../../../common/Modal/ModalActions';
import EditClusterWideProxyDialog from './EditClusterWideProxyDialog';
import { editCluster, clearClusterResponse } from '../../../../../../../../redux/actions/clustersActions';

const reduxFormConfig = {
  form: 'EditClusterWideProxy',
  enableReinitialize: true,
  touchOnChange: true,
  touchOnBlur: true,
};

const reduxFormEditCWProxy = reduxForm(reduxFormConfig)(EditClusterWideProxyDialog);

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_WIDE_PROXY),
    initialValues: {
      clusterID: cluster.id,
      httpProxyUrl: cluster.proxy?.http_proxy,
      httpsProxyUrl: cluster.proxy?.https_proxy,
    },
    additionalTrustBundle: cluster?.additional_trust_bundle,
    editClusterProxyResponse: state.clusters.editedCluster,
    meta: getFormMeta('EditClusterWideProxy')(state),
  };
};

const mapDispatchToProps = dispatch => ({
  clearClusterProxyResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  onSubmit: (formData) => {
    const clusterProxyBody = {
      proxy: {
        http_proxy: formData.httpProxyUrl,
        https_proxy: formData.httpsProxyUrl,
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
    dispatchProps.onSubmit(
      formData,
    );
  };
  return ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  });
};

// eslint-disable-next-line max-len
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditCWProxy);
