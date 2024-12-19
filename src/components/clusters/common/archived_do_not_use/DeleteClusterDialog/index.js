import { connect } from 'react-redux';

import { closeModal } from '../../../../common/Modal/ModalActions';

import DeleteClusterDialog from './DeleteClusterDialog';
import { deleteClusterDialogActions } from './DeleteClusterDialogActions';

const mapStateToProps = (state) => ({
  modalData: state.modal.data,
  deleteClusterResponse: state.deleteCluster,
  shouldDisplayClusterName: state.modal.data.shouldDisplayClusterName || false,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => deleteClusterDialogActions.deletedClusterResponse(),
  deleteCluster: (clusterID) => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DeleteClusterDialog);
