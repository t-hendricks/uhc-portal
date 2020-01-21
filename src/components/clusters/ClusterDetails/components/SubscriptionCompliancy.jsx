import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { Alert } from '@patternfly/react-core';
import { entitlementStatuses } from '../../../../common/subscriptionTypes';
import getClusterEvaluationExpiresInDays from '../../../../common/getClusterEvaluationExpiresInDays';
import {
  getSubscriptionManagementURL,
  getSubscriptionLastReconciledDate,
} from '../clusterDetailsHelper';

function SubscriptionCompliancy({ cluster }) {
  const subscription = get(cluster, 'subscription');

  const ocpSubscriptionType = get(subscription, 'plan.id') === 'OCP';
  if (!ocpSubscriptionType) {
    return null;
  }

  const candlepinConsumerUUID = get(subscription, 'consumer_uuid');
  const customerPortalURL = getSubscriptionManagementURL(subscription);
  const salesURL = 'https://www.redhat.com/en/contact';
  const lastReconcileDate = getSubscriptionLastReconciledDate(subscription);

  const clusterCreationCloseTo30Days = moment().diff(cluster.creation_timestamp, 'days') >= 29;
  const evaluationExpiresStr = getClusterEvaluationExpiresInDays(cluster);

  const lastChecked = lastReconcileDate
    ? (
      <p>
        Last checked:&nbsp;
        {lastReconcileDate}
      </p>
    )
    : '';

  switch (subscription.entitlement_status) {
    case entitlementStatuses.NOT_SUBSCRIBED:
      return (
        <Alert id="subs-hint" isInline variant={clusterCreationCloseTo30Days ? 'danger' : 'warning'} title="This cluster is not attached to a subscription">
          {lastChecked}
          <p>
            Find&nbsp;
            { !candlepinConsumerUUID ? 'this cluster in the ' : '' }
            <a href={customerPortalURL} rel="noreferrer noopener" target="_blank">
              { candlepinConsumerUUID ? 'this cluster in the ' : '' }
              Red Hat Customer Portal
            </a>
            &nbsp;and attach subscription(s) that covers the current size of
            this cluster. You may need to&nbsp;
            <a href={salesURL} rel="noreferrer noopener" target="_blank">contact sales</a>
            &nbsp;in case you don&apos;t own enough subscriptions to cover it.
          </p>
        </Alert>
      );
    case entitlementStatuses.OVERCOMMITTED:
      return (
        <Alert id="subs-hint" isInline variant="warning" title="This cluster is overcommitting resources">
          {lastChecked}
          <p>
            Check the&nbsp;
            <a href={customerPortalURL} rel="noreferrer noopener" target="_blank">Red Hat Customer Portal</a>
            &nbsp;to make sure this cluster has subscription(s) attached that covers
            the current size of this cluster. You may need to&nbsp;
            <a href={customerPortalURL} rel="noreferrer noopener" target="_blank">Red Hat Customer Portal</a>
            <a href={salesURL} rel="noreferrer noopener" target="_blank">contact sales</a>
            &nbsp;in case you don&apos;t own enough subscriptions to cover it.
          </p>
        </Alert>
      );
    case entitlementStatuses.INCONSISTENT_SERVICES:
      return (
        <Alert id="subs-hint" isInline variant="warning" title="This cluster is attached to subscriptions with different service levels">
          {lastChecked}
          <p>
            Go to the&nbsp;
            <a href={customerPortalURL} rel="noreferrer noopener" target="_blank">Red Hat Customer Portal</a>
            &nbsp;to make sure all subscriptions attached are of the same service level
            (e.g. either Standard, Premium).
          </p>
        </Alert>
      );
    case entitlementStatuses.SIXTY_DAY_EVALUATION:
      return (
        <Alert id="subs-hint" isInline variant="warning" title={`Your evaluation expires in ${evaluationExpiresStr}`}>
          {lastChecked}
          <p>
            {`Your 60-day OpenShift evaluation expires in ${evaluationExpiresStr}. `}
            <a href={customerPortalURL} target="_blank" rel="noreferrer noopener">Attach a subscription</a>
            {' to your cluster for non-evaluation use. '}
            <a href={salesURL} target="_blank" rel="noreferrer noopener">Contact sales</a>
            {' if you are not an active OpenShift customer.'}
          </p>
        </Alert>
      );
    default:
      return null;
  }
}

SubscriptionCompliancy.propTypes = {
  cluster: PropTypes.shape({
    creation_timestamp: PropTypes.string,
  }),
};

export default SubscriptionCompliancy;
