import { action, ActionType } from 'typesafe-actions';
import OCMRolesConstants from '../constants/OCMRolesConstants';
import { accountsService } from '../../services';

const getOCMRoles = (subID: string) =>
  action(OCMRolesConstants.GET_OCM_ROLES, accountsService.getSubscriptionRoleBindings(subID));

const grantOCMRole = (subID: string, username: string, roleID: string) =>
  action(
    OCMRolesConstants.GRANT_OCM_ROLE,
    accountsService.createSubscriptionRoleBinding(subID, username, roleID),
  );

const deleteOCMRole = (subID: string, roleBindingID: string) =>
  action(
    OCMRolesConstants.DELETE_OCM_ROLE,
    accountsService.deleteSubscriptionRoleBinding(subID, roleBindingID),
  );

const clearGetOCMRolesResponse = () => action(OCMRolesConstants.CLEAR_GET_OCM_ROLES_RESPONSE);

const clearGrantOCMRoleResponse = () => action(OCMRolesConstants.CLEAR_GRANT_OCM_ROLE_RESPONSE);

const clearDeleteOCMRoleResponse = () => action(OCMRolesConstants.CLEAR_DELETE_OCM_ROLE_RESPONSE);

const OCMRolesActions = {
  getOCMRoles,
  grantOCMRole,
  deleteOCMRole,
  clearGetOCMRolesResponse,
  clearGrantOCMRoleResponse,
  clearDeleteOCMRoleResponse,
} as const;

export type OCMRoleAction = ActionType<typeof OCMRolesActions[keyof typeof OCMRolesActions]>;

export default OCMRolesActions;
