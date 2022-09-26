import { createAuthorizationToken } from '../../services/accountManager';

const ACTION_TYPE = 'FETCH_AUTHORIZATION_TOKEN';

const createAuthToken = () => (dispatch) =>
  dispatch({
    type: ACTION_TYPE,
    payload: createAuthorizationToken(),
  });

const tollboothActions = {
  createAuthToken,
};

export { tollboothActions, ACTION_TYPE };
