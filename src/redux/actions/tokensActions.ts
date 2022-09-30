import { action, ActionType } from 'typesafe-actions';
import { accountsService } from '../../services';
import CREATE_ENTITLEMENT_CONFIG from '../constants/entitlementConfigConstants';
import type { AppThunk } from '../types';

const createRosaEntitlementAction = () =>
  action(CREATE_ENTITLEMENT_CONFIG, accountsService.createRosaEntitlement());
const createRosaEntitlement = (): AppThunk => (dispatch) => dispatch(createRosaEntitlementAction());

const tokensActions = {
  createRosaEntitlement,
};

type TokensAction = ActionType<typeof createRosaEntitlementAction>;

export { tokensActions, createRosaEntitlement, TokensAction };
