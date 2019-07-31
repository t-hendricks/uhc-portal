import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import EditClusterDialog from './EditClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import minValueSelector from './EditClusterSelectors';

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
    isMultiAz: modalData.multi_az,
    initialFormValues: {
      id: modalData.id,
      nodesCompute: modalData.nodes ? modalData.nodes.compute : null,
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
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditCluster);
