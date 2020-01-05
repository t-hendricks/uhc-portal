import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import EditClusterDialog from './EditClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import getLoadBalancerValues from '../../../../redux/actions/loadBalancerActions';
import getPersistentStorageValues from '../../../../redux/actions/persistentStorageActions';
import { minValueSelector, shouldShowStorageQuotaAlert, shouldShowLoadBalancerAlert } from './EditClusterSelectors';

const reduxFormConfig = {
  form: 'EditCluster',
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(EditClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-cluster'),
    editClusterResponse: state.clusters.editedCluster,
    min: minValueSelector(modalData.multi_az),
    consoleURL: get(modalData, 'console.url', null),
    isMultiAz: modalData.multi_az,
    showLoadBalancerAlert: shouldShowLoadBalancerAlert(state),
    showPersistentStorageAlert: shouldShowStorageQuotaAlert(state),
    loadBalancerValues: state.loadBalancerValues.loadBalancerValues,
    persistentStorageValues: state.persistentStorageValues.persistentStorageValues,
    initialFormValues: {
      id: modalData.id,
      nodesCompute: modalData.nodes ? modalData.nodes.compute : null,
      load_balancers: modalData.load_balancer_quota
        ? modalData.load_balancer_quota.toString() : null,
      persistent_storage: modalData.storage_quota ? modalData.storage_quota.value.toString() : null,
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    // Update cluster nodes
    const clusterRequest = {
      nodes: {
        compute: parseInt(formData.nodes_compute, 10),
      },
      load_balancer_quota: formData.load_balancers ? parseInt(formData.load_balancers, 10) : null,
      // values in the passed are always in bytes.
      // see comment in PersistentStorageComboBox.js#82.
      storage_quota: formData.persistent_storage ? {
        unit: 'B',
        value: parseFloat(formData.persistent_storage),
      } : null,
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  getPersistentStorage: getPersistentStorageValues,
  getLoadBalancers: getLoadBalancerValues,
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditCluster);
