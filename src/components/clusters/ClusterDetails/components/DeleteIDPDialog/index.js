import { connect } from 'react-redux';

import { deleteIDP, resetDeletedIDPResponse } from '../IdentityProvidersPage/IdentityProvidersActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import DeleteIDPDialog from './DeleteIDPDialog';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'delete-idp'),
  modalData: state.modal.data,
  deletedIDPResponse: state.identityProviders.deletedIDP,
});

const mapDispatchToProps = {
  clearDeleteIDPResponse: () => resetDeletedIDPResponse(),
  deleteIDP: (clusterID, idpID) => deleteIDP(clusterID, idpID),
  close: () => closeModal(),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteIDPDialog);
