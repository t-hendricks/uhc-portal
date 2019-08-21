import { connect } from 'react-redux';

import {
  clearClusterArchiveResponse,
  archiveCluster,
} from '../../../../redux/actions/clustersActions';
import ArchiveClusterDialog from './ArchiveClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  return ({
    isOpen: shouldShowModal(state, 'archive-cluster'),
    archiveClusterResponse: state.clusters.archivedCluster,
    subscriptionID: modalData.subscriptionID ? modalData.subscriptionID : '',
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (subscriptionID) => {
    dispatch(archiveCluster(subscriptionID));
  },
  resetResponse: () => dispatch(clearClusterArchiveResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveClusterDialog);
