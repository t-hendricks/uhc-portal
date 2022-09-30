import { action, ActionType } from 'typesafe-actions';
import { createAuthorizationToken } from '../../services/accountManager';
import type { AppThunk } from '../types';

const ACTION_TYPE = 'FETCH_AUTHORIZATION_TOKEN';

const createAuthTokenAction = () => action(ACTION_TYPE, createAuthorizationToken());

const createAuthToken = (): AppThunk => (dispatch) => dispatch(createAuthTokenAction());

const tollboothActions = {
  createAuthToken,
};

type TollboothAction = ActionType<typeof createAuthTokenAction>;

export { tollboothActions, ACTION_TYPE, TollboothAction };
