import { action, ActionType } from 'typesafe-actions';

import { clusterService } from '~/services';

const GET_DELETE_PROTECTION = 'GET_DELETE_PROTECTION';
const UPDATE_DELETE_PROTECTION = 'UPDATE_DELETE_PROTECTION';
const CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE = 'CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE';

const deleteProtectionConstants = {
  GET_DELETE_PROTECTION,
  UPDATE_DELETE_PROTECTION,
  CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE,
};

const getDeleteProtection = (clusterID: string) =>
  action(GET_DELETE_PROTECTION, clusterService.getDeleteProtection(clusterID));

const updateDeleteProtection = (clusterID: string, isProtected: boolean) =>
  action(UPDATE_DELETE_PROTECTION, clusterService.updateDeleteProtection(clusterID, isProtected));

const clearUpdateDeleteProtection = () => action(CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE);

const deleteProtectionActions = { getDeleteProtection, updateDeleteProtection };

type DeleteProtectionActions = ActionType<typeof deleteProtectionActions>;

export {
  deleteProtectionActions,
  getDeleteProtection,
  updateDeleteProtection,
  DeleteProtectionActions,
  deleteProtectionConstants,
  clearUpdateDeleteProtection,
};
