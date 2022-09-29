import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import ScaleClusterDialog from './ScaleClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getLoadBalancerValues from '../../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../../redux/actions/persistentStorageActions';
import {
  minValueSelector,
  shouldShowStorageQuotaAlert,
  shouldShowLoadBalancerAlert,
} from './ScaleClusterSelectors';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import getClusterName from '../../../../common/getClusterName';

const reduxFormConfig = {
  form: 'ScaleCluster',
  enableReinitialize: true,
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(ScaleClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return {
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
    editClusterResponse: state.clusters.editedCluster,
    min: minValueSelector(modalData.multi_az, modalData.ccs?.enabled),
    consoleURL: get(modalData, 'console.url', null),
    clusterDisplayName: getClusterName(modalData),
    showLoadBalancerAlert: shouldShowLoadBalancerAlert(state),
    showPersistentStorageAlert: shouldShowStorageQuotaAlert(state),
    persistentStorageValues: state.persistentStorageValues,
    loadBalancerValues: state.loadBalancerValues,
    organization: state.userProfile.organization,
    isByoc: modalData.ccs?.enabled,
    // eslint-disable-next-line camelcase
    billingModel: modalData.subscription?.cluster_billing_model,
    product: modalData.subscription?.plan.type,
    isMultiAZ: modalData.multi_az,
    cloudProviderID: get(modalData, 'cloud_provider.id', ''),
    initialValues: {
      id: modalData.id,
      nodes_compute: modalData.nodes ? modalData.nodes.compute : null,
      load_balancers: modalData.load_balancer_quota ? modalData.load_balancer_quota : 0,
      persistent_storage: modalData.storage_quota ? modalData.storage_quota.value : 107374182400,
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formData, isByoc) => {
    const clusterRequest = {};
    if (!isByoc) {
      clusterRequest.load_balancer_quota = formData.load_balancers
        ? parseInt(formData.load_balancers, 10)
        : null;
      // values in the passed are always in bytes.
      // see comment in PersistentStorageDropdown.js#82.
      clusterRequest.storage_quota = formData.persistent_storage
        ? {
            unit: 'B',
            value: parseFloat(formData.persistent_storage),
          }
        : null;
    }
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getPersistentStorage: getPersistentStorageValues,
  getLoadBalancers: getLoadBalancerValues,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData, stateProps.isByoc);
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditCluster);
