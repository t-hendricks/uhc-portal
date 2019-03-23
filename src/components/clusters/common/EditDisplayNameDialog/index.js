import { connect } from 'react-redux';

import { editCluster, clearClusterResponse } from '../../../../redux/actions/clustersActions';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-display-name'),
    editClusterResponse: state.clusters.editedCluster,
    clusterID: modalData.id,
    displayName: modalData.display_name || modalData.name,
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID, displayName) => {
    const clusterRequest = {
      display_name: displayName,
    };
    dispatch(editCluster(clusterID, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDisplayNameDialog);
