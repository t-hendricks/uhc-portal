import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Alert, Button } from '@patternfly/react-core';
import { subscriptionSupportLevels, subscriptionStatuses } from '../../../../common/subscriptionTypes';
import getClusterName from '../../../../common/getClusterName';
import getClusterEvaluationExpiresInDays from '../../../../common/getClusterEvaluationExpiresInDays';
import {
  getSubscriptionLastReconciledDate,
} from '../clusterDetailsHelper';

function SubscriptionCompliancy({ cluster, openModal }) {
  const subscription = get(cluster, 'subscription');

  const planID = get(subscription, 'plan.id');
  if (planID !== 'OCP') {
    return null;
  }

  const supportLevel = get(subscription, 'support_level');
  if (supportLevel !== subscriptionSupportLevels.EVAL
    && supportLevel !== subscriptionSupportLevels.NONE) {
    return null;
  }

  const status = get(subscription, 'status');
  if (status === subscriptionStatuses.ARCHIVED || status === subscriptionStatuses.DEPROVISIONED) {
    return null;
  }

  const salesURL = 'https://www.redhat.com/en/contact';
  const lastReconcileDate = getSubscriptionLastReconciledDate(subscription);
  const evaluationExpiresStr = getClusterEvaluationExpiresInDays(cluster);
  const clusterName = getClusterName(cluster);

  const lastChecked = lastReconcileDate
    ? (
      <p>
        Last checked:&nbsp;
        {lastReconcileDate}
      </p>
    )
    : '';

  const handleEditSettings = () => {
    openModal('edit-subscription-settings', subscription);
  };

  const handleArchiveCluster = () => {
    const data = {
      subscriptionID: get(subscription, 'id'),
      name: clusterName,
    };
    openModal('archive-cluster', data);
  };

  if (supportLevel === subscriptionSupportLevels.NONE) {
    return (
      <Alert className="subscription-settings compliancy-alert" isInline variant="danger" title="Your 60-day OpenShift evaluation has expired">
        {lastChecked}
        <p>
          Your cluster is not supported and you may stop receving updates.
          {' '}
          <Button variant="link" isInline isDisabled={!cluster.canEdit} onClick={handleEditSettings}>Edit subscription settings</Button>
          {' for non-evaluation use. '}
          <a href={salesURL} target="_blank" rel="noreferrer noopener">Contact sales</a>
          {' if you are not an active OpenShift customer. '}
          <Button variant="link" isInline isDisabled={!cluster.canEdit} onClick={handleArchiveCluster}>Archive this cluster</Button>
          {' if it no longer exits. '}
        </p>
      </Alert>
    );
  }
  return (
    <Alert className="subscription-settings compliancy-alert" isInline variant="warning" title={`Your OpenShift evaluation expires in ${evaluationExpiresStr}`}>
      {lastChecked}
      <p>
        {`Your 60-day OpenShift evaluation expires in ${evaluationExpiresStr}. `}
        <Button variant="link" isInline isDisabled={!cluster.canEdit} onClick={handleEditSettings}>Edit subscription settings</Button>
        {' for non-evaluation use. '}
        <a href={salesURL} target="_blank" rel="noreferrer noopener">Contact sales</a>
        {' if you are not an active OpenShift customer.'}
      </p>
    </Alert>
  );
}

SubscriptionCompliancy.propTypes = {
  cluster: PropTypes.shape({
    creation_timestamp: PropTypes.string,
    canEdit: PropTypes.bool,
  }),
  openModal: PropTypes.func.isRequired,
};

export default SubscriptionCompliancy;
