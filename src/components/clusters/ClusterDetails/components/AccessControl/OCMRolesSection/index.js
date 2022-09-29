import { connect } from 'react-redux';
import get from 'lodash/get';

import OCMRolesActions from './OCMRolesActions';
import OCMRolesSection from './OCMRolesSection';
import canGrantClusterViewerSelector from './OCMRolesSelector';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';
import modals from '../../../../../common/Modal/modals';

const mapStateToProps = (state) => {
  const { getOCMRolesResponse, grantOCMRoleResponse, editOCMRoleResponse, deleteOCMRoleResponse } =
    state.ocmRoles;
  const canGrantClusterViewer = canGrantClusterViewerSelector(state);

  return {
    canGrantClusterViewer,
    getOCMRolesResponse,
    grantOCMRoleResponse,
    editOCMRoleResponse,
    deleteOCMRoleResponse,
    isOCMRolesDialogOpen: shouldShowModal(state, modals.OCM_ROLES),
    modalData: get(state, 'modal.data', {}),
  };
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (modalId, data) => dispatch(openModal(modalId, data)),
  closeModal: () => dispatch(closeModal()),
  getOCMRoles: (subID) => dispatch(OCMRolesActions.getOCMRoles(subID)),
  grantOCMRole: (subID, username, roleID) =>
    dispatch(OCMRolesActions.grantOCMRole(subID, username, roleID)),
  editOCMRole: (subID, roleBindingID, newRoleID) =>
    dispatch(OCMRolesActions.editOCMRole(subID, roleBindingID, newRoleID)),
  deleteOCMRole: (subID, roleBindingID) =>
    dispatch(OCMRolesActions.deleteOCMRole(subID, roleBindingID)),
  clearGetOCMRolesResponse: () => dispatch(OCMRolesActions.clearGetOCMRolesResponse()),
  clearGrantOCMRoleResponse: () => dispatch(OCMRolesActions.clearGrantOCMRoleResponse()),
  clearEditOCMRoleResponse: () => dispatch(OCMRolesActions.clearEditOCMRoleResponse()),
  clearDeleteOCMRoleResponse: () => dispatch(OCMRolesActions.clearDeleteOCMRoleResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OCMRolesSection);
