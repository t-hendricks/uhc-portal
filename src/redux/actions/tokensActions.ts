import { action, ActionType } from 'typesafe-actions';
import { accountsService } from '../../services';
import CREATE_ENTITLEMENT_CONFIG from '../constants/entitlementConfigConstants';

const createRosaEntitlement = () =>
  action(CREATE_ENTITLEMENT_CONFIG, accountsService.createRosaEntitlement());

const tokensActions = {
  createRosaEntitlement,
};

type TokensAction = ActionType<typeof tokensActions>;

export { tokensActions, createRosaEntitlement, TokensAction };
