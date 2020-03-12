import { connect } from 'react-redux';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../../common/Modal/ModalSelectors';
import ChangePrivacySettingsDialog from './ChangePrivacySettingsDialog';
import { resetEditRoutersResponse } from '../../NetworkingActions';

const mapStateToProps = (state) => {
  const { shouldShowAlert } = state.modal.data;
  return {
    shouldShowAlert,
    isOpen: shouldShowModal(state, 'change-privacy-settings'),
    editClusterRoutersResponse: state.clusterRouters.editRouters,
  };
};

const mapDispatchToProps = dispatch => ({
  resetResponse: () => dispatch(resetEditRoutersResponse()),
  closeModal: () => dispatch(closeModal('change-privacy-settings')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePrivacySettingsDialog);
