import {
  GET_ROLES,
  ADD_GRANT,
  GET_GRANTS,
  CLEAR_ADD_GRANT_RESPONSE,
  DELETE_GRANT,
} from './NetworkSelfServiceConstants';
import { clusterService } from '../../../../../../services';

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
