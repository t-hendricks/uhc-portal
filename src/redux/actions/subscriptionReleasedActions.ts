import { action, ActionType } from 'typesafe-actions';

import {
  CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE,
  TOGGLE_SUBSCRIPTION_RELEASED,
} from '~/components/clusters/common/TransferClusterOwnershipDialog/models/subscriptionReleasedConstants';
import { accountsService } from '~/services';

const toggleSubscriptionReleased = (subscriptionID: string, released?: boolean) => {
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
  return action(
    TOGGLE_SUBSCRIPTION_RELEASED,
    accountsService.editSubscription(subscriptionID, { released }),
    meta,
  );
};

const clearToggleSubscriptionReleasedResponse = () =>
  action(CLEAR_TOGGLE_SUBSCRIPTION_RELEASED_RESPONSE);

const subscriptionReleasedActions = {
  toggleSubscriptionReleased,
  clearToggleSubscriptionReleasedResponse,
};

type SubscriptionReleasedActions = ActionType<typeof subscriptionReleasedActions>;

export {
  subscriptionReleasedActions,
  toggleSubscriptionReleased,
  clearToggleSubscriptionReleasedResponse,
  SubscriptionReleasedActions,
};
