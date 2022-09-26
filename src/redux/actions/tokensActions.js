import { accountsService } from '../../services';
import CREATE_ENTITLEMENT_CONFIG from '../constants/entitlementConfigConstants';

function createRosaEntitlement() {
  return (dispatch) =>
    dispatch({
      type: CREATE_ENTITLEMENT_CONFIG,
      payload: accountsService.createRosaEntitlement(),
    });
}

const tokensActions = {
  createRosaEntitlement,
};

export { tokensActions, createRosaEntitlement };
