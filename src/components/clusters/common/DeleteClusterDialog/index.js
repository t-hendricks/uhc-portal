import { connect } from 'react-redux';

import { deleteClusterDialogActions } from './DeleteClusterDialogActions';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import DeleteClusterDialog from './DeleteClusterDialog';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'delete-cluster'),
  modalData: state.modal.data,
  deleteClusterResponse: state.deleteCluster,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => deleteClusterDialogActions.deletedClusterResponse(),
  deleteCluster: clusterID => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
