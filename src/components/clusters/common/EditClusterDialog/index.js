import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { editCluster, clearClusterResponse } from '../../../../redux/actions/clustersActions';
import EditClusterDialog from './EditClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';


const reduxFormConfig = {
  form: 'EditCluster',
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(EditClusterDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-cluster'),
    editClusterResponse: state.clusters.editedCluster,
    initialFormValues: {
      id: modalData.id,
      nodesCompute: modalData.nodes ? modalData.nodes.compute : null,
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
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
