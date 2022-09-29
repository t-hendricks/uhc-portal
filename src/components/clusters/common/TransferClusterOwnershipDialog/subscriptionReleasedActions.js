import {
  TOGGLE_SUBSCRIPTION_RELEASED,
  CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE,
} from './subscriptionReleasedConstants';
import { accountsService } from '../../../../services';

function toggleSubscriptionReleased(subscriptionID, released) {
  // show notfication when it's cancel
  const meta = released
    ? null
    : {
        notifications: {
          fulfilled: {
            variant: 'success',
            title: 'Cluster ownership transfer canceled',
            dismissDelay: 8000,
            dismissable: false,
          },
        },
      };
  return (dispatch) =>
    dispatch({
      type: TOGGLE_SUBSCRIPTION_RELEASED,
      payload: accountsService.editSubscription(subscriptionID, { released }),
      meta,
    });
}

function clearToggleSubscriptionReleasedResponse() {
  return (dispatch) =>
    dispatch({
      type: CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE,
    });
}

export { toggleSubscriptionReleased, clearToggleSubscriptionReleasedResponse };
