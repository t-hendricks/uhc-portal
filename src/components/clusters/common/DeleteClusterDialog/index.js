import { connect } from 'react-redux';

import { deleteClusterDialogActions } from './DeleteClusterDialogActions';
import { closeModal } from '../../../common/Modal/ModalActions';
import DeleteClusterDialog from './DeleteClusterDialog';

const mapStateToProps = state => ({
  modalData: state.modal.data,
  deleteClusterResponse: state.deleteCluster,
  shouldDisplayClusterName: state.modal.data.shouldDisplayClusterName || false,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => deleteClusterDialogActions.deletedClusterResponse(),
  deleteCluster: clusterID => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
