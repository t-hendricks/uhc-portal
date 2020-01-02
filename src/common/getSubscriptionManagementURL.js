import get from 'lodash/get';

const getSubscriptionManagementURL = subscription => (
  get(subscription, 'consumer_uuid', false)
    ? `https://access.redhat.com/management/systems/${get(subscription, 'consumer_uuid')}/subscriptions`
    : 'https://access.redhat.com/management/systems'
);

export default getSubscriptionManagementURL;
