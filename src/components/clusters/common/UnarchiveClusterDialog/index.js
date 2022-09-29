import { connect } from 'react-redux';

import {
  clearClusterUnarchiveResponse,
  unarchiveCluster,
} from '../../../../redux/actions/clustersActions';
import UnarchiveClusterDialog from './UnarchiveClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return {
    isOpen: shouldShowModal(state, 'unarchive-cluster'),
    unarchiveClusterResponse: state.clusters.unarchivedCluster,
    subscriptionID: modalData.subscriptionID ? modalData.subscriptionID : '',
    name: modalData.name ? modalData.name : '',
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submit: (subscriptionID, name) => {
    dispatch(unarchiveCluster(subscriptionID, name));
  },
  resetResponse: () => dispatch(clearClusterUnarchiveResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnarchiveClusterDialog);
