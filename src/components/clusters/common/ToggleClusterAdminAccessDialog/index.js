import { connect } from 'react-redux';
import ToggleClusterAdminAccessDialog from './ToggleClusterAdminAccessDialog';
import toggleClusterAdminAccess from './ClusterAdminActions';
import { clearClusterResponse } from '../../../../redux/actions/clustersActions';

import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'allow-cluster-admin'),
  modalData: state.modal.data,
  toggleClusterAdminResponse: state.clusters.editedCluster,
});

const mapDispatchToProps = {
  closeModal,
  toggleClusterAdminAccess,
  clearToggleClusterAdminResponse: () => clearClusterResponse(),
};

export default connect(mapStateToProps, mapDispatchToProps)(ToggleClusterAdminAccessDialog);
