import { createAuthorizationToken } from '../../services/accountManager';

const createAuthToken = () => dispatch => dispatch({
  type: 'FETCH_AUTHORIZATION_TOKEN',
  payload: createAuthorizationToken(),
});

export default createAuthToken;
