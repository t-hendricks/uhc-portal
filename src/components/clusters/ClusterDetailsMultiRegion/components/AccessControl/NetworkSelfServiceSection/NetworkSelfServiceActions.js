import { clusterService } from '../../../../../../services';

import {
  ADD_GRANT,
  CLEAR_ADD_GRANT_RESPONSE,
  DELETE_GRANT,
  GET_GRANTS,
  GET_ROLES,
} from './NetworkSelfServiceConstants';

const getRoles = () => (dispatch) =>
  dispatch({
    type: GET_ROLES,
    payload: clusterService.getRoles(),
  });

const getGrants = (clusterID) => (dispatch) =>
  dispatch({
    type: GET_GRANTS,
    payload: clusterService.getGrants(clusterID),
  });

const addGrant = (clusterID, roleId, arn) => (dispatch) =>
  dispatch({
    type: ADD_GRANT,
    payload: clusterService.addGrant(clusterID, roleId, arn),
  });

const deleteGrant = (clusterID, grantId) => (dispatch) =>
  dispatch({
    type: DELETE_GRANT,
    payload: clusterService.deleteGrant(clusterID, grantId),
  });

const clearAddGrantResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_ADD_GRANT_RESPONSE,
  });

const NetworkSelfServiceActions = {
  getRoles,
  getGrants,
  addGrant,
  clearAddGrantResponse,
  deleteGrant,
};

export { getRoles, getGrants, addGrant, clearAddGrantResponse, deleteGrant };

export default NetworkSelfServiceActions;
