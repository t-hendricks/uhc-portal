import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Grid, GridItem, Button, Card, CardBody, Title, CardTitle,
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon, ExclamationTriangleIcon,
} from '@patternfly/react-icons';

import {
  subscriptionSupportLevels,
  subscriptionSystemUnits,
  subscriptionStatuses,
  subscriptionSettings,
} from '../../../../../../common/subscriptionTypes';

function SubscriptionSettings({
  subscription, openModal,
  canEdit = false, canSubscribeOCP = false,
}) {
  const planID = get(subscription, 'plan.id');
  if (planID !== 'OCP') {
    return null;
  }

  const handleEditSettings = () => {
    openModal('edit-subscription-settings', subscription);
  };

  const status = get(subscription, 'status');
  const isEditViewable = canEdit
    && status !== subscriptionStatuses.ARCHIVED
    && status !== subscriptionStatuses.DEPROVISIONED;

  // SUPPORT_LEVEL
  const supportLevel = get(subscription, subscriptionSettings.SUPPORT_LEVEL, 'Not set');
  let supportLevelStr = supportLevel;
  let titleIcon = null;
  if (supportLevel === subscriptionSupportLevels.EVAL) {
    supportLevelStr = 'Self-support 60-day evaluation';
    if (isEditViewable) {
      titleIcon = <ExclamationTriangleIcon className="subscription-settings warning-title-icon" />;
    }
  } else if (supportLevel === subscriptionSupportLevels.NONE) {
    supportLevelStr = 'Evaluation expired';
    if (isEditViewable) {
      titleIcon = <ExclamationCircleIcon className="subscription-settings danger-title-icon" />;
    }
  }

  // the rest
  const usageStr = get(subscription, subscriptionSettings.USAGE, 'Not set');
  const serviceLevelStr = get(subscription, subscriptionSettings.SERVICE_LEVEL, 'Not set');
  const systemUnitsStr = get(subscription, subscriptionSettings.SYSTEM_UNITS,
    subscriptionSystemUnits.CORES_VCPU);
  const productBundleStr = get(subscription, subscriptionSettings.PRODUCT_BUNDLE, 'Not set');
  const cpuTotal = get(subscription, subscriptionSettings.CPU_TOTAL, 0);
  const cpuTotalStr = `${cpuTotal} core${cpuTotal === 1 ? '' : 's'}`;
  const socketTotal = get(subscription, subscriptionSettings.SOCKET_TOTAL, 0);
  const socketTotalStr = `${socketTotal} socket${socketTotal === 1 ? '' : 's'}`;
  const obligationStr = systemUnitsStr === subscriptionSystemUnits.SOCKETS
    ? socketTotalStr : cpuTotalStr;

  const salesURL = 'https://www.redhat.com/en/contact';

  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="card-title">
          Subscription settings
          {titleIcon}
        </Title>
      </CardTitle>
      <CardBody>
        <Grid>
          <GridItem sm={6}>
            <dl className="cluster-details-item left">
              <dt>SLA</dt>
              <dd>{supportLevelStr}</dd>
              <dt>Production status</dt>
              <dd>{usageStr}</dd>
              <dt>Service level</dt>
              <dd>{serviceLevelStr}</dd>
              {isEditViewable && (
              <dd>
                {canSubscribeOCP ? (
                  <Button variant="link" isInline onClick={handleEditSettings}>Edit subscription settings</Button>
                ) : (
                  <>
                    <a href={salesURL} target="_blank" rel="noreferrer noopener">Contact sales</a>
                    {' to purchase an OpenShift subscription.'}
                  </>
                )}
              </dd>
              )}
            </dl>
          </GridItem>
          <GridItem sm={6}>
            <dl className="cluster-details-item right">
              <dt>Subscription units</dt>
              <dd>{systemUnitsStr}</dd>
              {false && ( // TODO: either add back or remove PRODUCT_BUNDLE
                <>
                  <dt>Subscription product</dt>
                  <dd>{productBundleStr}</dd>
                </>
              )}
              <dt>Subscription obligation</dt>
              <dd>{obligationStr}</dd>
            </dl>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}

SubscriptionSettings.propTypes = {
  subscription: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canSubscribeOCP: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default SubscriptionSettings;
