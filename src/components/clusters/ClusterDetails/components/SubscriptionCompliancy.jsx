import React from 'react';
import get from 'lodash/get';
import { Alert } from '@patternfly/react-core';
import { getTimeDelta } from '../../../../common/helpers';

function SubscriptionCompliancy(props) {
  const { cluster } = props;

  const subscription = cluster.subscriptionInfo;

  const ocpSubscriptionType = get(subscription, 'plan.id') === 'OCP';
  if (!ocpSubscriptionType) {
    return null;
  }

  const candlepinConsumerUUID = get(subscription, 'consumer_uuid');
  const customerPortalURL = candlepinConsumerUUID
    ? `https://access.redhat.com/management/systems/${candlepinConsumerUUID}/subscriptions`
    : 'https://access.redhat.com/management/systems';
  const salesURL = 'https://www.redhat.com/en/contact';
  const lastReconcileDate = get(subscription, 'last_reconcile_date');

  const clusterCreationDelta = getTimeDelta(new Date(cluster.creation_timestamp));
  const clusterCreationCloseTo30Days = clusterCreationDelta >= 24 * 29;

  const lastChecked = lastReconcileDate
    ? (
      <p>
        Last checked:&nbsp;
        {new Date(lastReconcileDate).toLocaleString()}
      </p>)
    : '';

  switch (subscription.entitlement_status) {
    case 'NotSet':
      return (
        <Alert id="subs-hint" isInline variant={clusterCreationCloseTo30Days ? 'danger' : 'warning'} title="This cluster is not attached to a subscription">
          {lastChecked}
          <p>
            Please find&nbsp;
            { !candlepinConsumerUUID ? 'this cluster in the ' : '' }
            <a href={customerPortalURL} target="_blank">
              { candlepinConsumerUUID ? 'this cluster in the ' : '' }
              Red Hat Customer Portal
            </a>
            &nbsp;and attach subscription(s) that covers&nbsp;
            { cluster.metrics.cpu.total.value
              ? `at least the amount of ${cluster.metrics.cpu.total.value} vCPUs which is `
              : '' }
            the current size of this cluster. You may need to&nbsp;
            <a href={salesURL} target="_blank">contact sales</a>
            &nbsp;in case you don&apos;t own enough subscriptions to cover it.
          </p>
        </Alert>
      );
    case 'Overcommitted':
      return (
        <Alert id="subs-hint" isInline variant="danger" title="This cluster is overcommitting resources">
          {lastChecked}
          <p>
            Please check the&nbsp;
            <a href={customerPortalURL} target="_blank">Red Hat Customer Portal</a>
            &nbsp;to make sure this cluster has subscription(s) attached that covers&nbsp;
            { cluster.metrics.cpu.total.value
              ? `at least the amount of ${cluster.metrics.cpu.total.value} vCPUs which is `
              : '' }
            the current size of this cluster. You may need to&nbsp;
            <a href={salesURL} target="_blank">contact sales</a>
            &nbsp;in case you don&apos;t own enough subscriptions to cover it.
          </p>
        </Alert>
      );
    case 'InconsistentServices':
      return (
        <Alert id="subs-hint" isInline variant="warning" title="This cluster is attached to subscriptions with different service levels">
          {lastChecked}
          <p>
            Please go to the&nbsp;
            <a href={customerPortalURL} target="_blank">Red Hat Customer Portal</a>
            &nbsp;to make sure all subscriptions attached are of the same service level
            (e.g. either Standard, Premium).
          </p>
        </Alert>
      );
    default:
      return null;
  }
}

export default SubscriptionCompliancy;
