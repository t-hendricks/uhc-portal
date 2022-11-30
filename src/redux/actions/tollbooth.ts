import { action, ActionType } from 'typesafe-actions';
import { createAuthorizationToken } from '../../services/accountManager';

const ACTION_TYPE = 'FETCH_AUTHORIZATION_TOKEN';

const createAuthToken = () => action(ACTION_TYPE, createAuthorizationToken());

const tollboothActions = {
  createAuthToken,
};

type TollboothAction = ActionType<typeof tollboothActions>;

export { tollboothActions, ACTION_TYPE, TollboothAction };
