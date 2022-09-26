import OCMRolesConstants from './OCMRolesConstants';
import { accountsService } from '../../../../../../services';

const getOCMRoles = (subID) => (dispatch) =>
  dispatch({
    type: OCMRolesConstants.GET_OCM_ROLES,
    payload: accountsService.getSubscriptionRoleBindings(subID),
  });

const grantOCMRole = (subID, username, roleID) => (dispatch) =>
  dispatch({
    type: OCMRolesConstants.GRANT_OCM_ROLE,
    payload: accountsService.createSubscriptionRoleBinding(subID, username, roleID),
  });

// TODO OCM RBAC phase 2: it's unclear how the edit would be implemented
const editOCMRole = () => (dispatch) =>
  dispatch({
    type: OCMRolesConstants.EDIT_OCM_ROLE,
  });

const deleteOCMRole = (subID, roleBindingID) => (dispatch) =>
  dispatch({
    type: OCMRolesConstants.DELETE_OCM_ROLE,
    payload: accountsService.deleteSubscriptionRoleBinding(subID, roleBindingID),
  });

const clearGetOCMRolesResponse = () => ({
  type: OCMRolesConstants.CLEAR_GET_OCM_ROLES_RESPONSE,
});

const clearGrantOCMRoleResponse = () => ({
  type: OCMRolesConstants.CLEAR_GRANT_OCM_ROLE_RESPONSE,
});

const clearEditOCMRoleResponse = () => ({
  type: OCMRolesConstants.CLEAR_EDIT_OCM_ROLE_RESPONSE,
});

const clearDeleteOCMRoleResponse = () => ({
  type: OCMRolesConstants.CLEAR_DELETE_OCM_ROLE_RESPONSE,
});

const OCMRolesActions = {
  getOCMRoles,
  grantOCMRole,
  editOCMRole,
  deleteOCMRole,
  clearGetOCMRolesResponse,
  clearGrantOCMRoleResponse,
  clearEditOCMRoleResponse,
  clearDeleteOCMRoleResponse,
};

export default OCMRolesActions;
