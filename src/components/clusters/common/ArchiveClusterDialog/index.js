import { connect } from 'react-redux';

import {
  clearClusterArchiveResponse,
  archiveCluster,
} from '../../../../redux/actions/clustersActions';
import ArchiveClusterDialog from './ArchiveClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return {
    archiveClusterResponse: state.clusters.archivedCluster,
    subscriptionID: modalData.subscriptionID ? modalData.subscriptionID : '',
    name: modalData.name ? modalData.name : '',
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submit: (subscriptionID, name) => {
    dispatch(archiveCluster(subscriptionID, name));
  },
  resetResponse: () => dispatch(clearClusterArchiveResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveClusterDialog);
