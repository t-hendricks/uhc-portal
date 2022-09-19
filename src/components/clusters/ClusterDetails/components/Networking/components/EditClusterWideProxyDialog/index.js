import { connect } from 'react-redux';
import {
  change, reduxForm, getFormMeta, formValueSelector, getFormValues,
} from 'redux-form';

import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { closeModal } from '~/components/common/Modal/ModalActions';
import { editCluster, clearClusterResponse } from '~/redux/actions/clustersActions';
import EditClusterWideProxyDialog from './EditClusterWideProxyDialog';
import { noProxyDomainsArray, noProxyDomainsString } from '../../NetworkingSelector';

const reduxFormConfig = {
  form: 'EditClusterWideProxy',
  enableReinitialize: true,
  touchOnChange: true,
  touchOnBlur: true,
};

const reduxFormEditCWProxy = reduxForm(reduxFormConfig)(EditClusterWideProxyDialog);

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const valueSelector = formValueSelector('CreateCluster');
  const formValues = getFormValues('CreateCluster')(state);

  return {
    isOpen: shouldShowModal(state, modals.EDIT_CLUSTER_WIDE_PROXY),
    initialValues: {
      clusterID: cluster.id,
      httpProxyUrl: cluster.proxy?.http_proxy,
      httpsProxyUrl: cluster.proxy?.https_proxy,
      // mms turn to string?
      noProxyDomains: cluster.proxy?.no_proxy,
    },
    product: valueSelector(state, 'product'),

    additionalTrustBundle: cluster?.additional_trust_bundle,
    editClusterProxyResponse: state.clusters.editedCluster,
    meta: getFormMeta('EditClusterWideProxy')(state),
    formValues,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearClusterProxyResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  onSubmit: (formData) => {
    console.log(formData);
    const clusterProxyBody = {
      proxy: {
        http_proxy: formData.httpProxyUrl,
        https_proxy: formData.httpsProxyUrl,
        no_proxy: formData.noProxyDomains ? formData.noProxyDomains.join(',') : null,
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
