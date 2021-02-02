import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';


import {
  ExclamationCircleIcon, ExclamationTriangleIcon,
} from '@patternfly/react-icons';

import {
  subscriptionSupportLevels,
  subscriptionSystemUnits,
  subscriptionStatuses,
  subscriptionSettings,
  normalizedProducts,
} from '../../../../../../common/subscriptionTypes';

function SubscriptionSettings({
  subscription, openModal,
  canEdit = false, canSubscribeOCP = false,
}) {
  const product = get(subscription, 'plan.id');
  if (product !== normalizedProducts.OCP) {
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
    supportLevelStr = 'Self-Support 60-day evaluation';
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
    <Card className="ocm-c-overview-subscription-settings__card">
      <CardTitle className="ocm-c-overview-subscription-settings__card--header">
        <Title headingLevel="h2" className="card-title">
          Subscription settings
          {titleIcon}
        </Title>
      </CardTitle>
      <CardBody className="ocm-c-overview-subscription-settings__card--body">
        <Grid>
          <GridItem md={6}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>SLA</DescriptionListTerm>
                <DescriptionListDescription>{supportLevelStr}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Production status</DescriptionListTerm>
                <DescriptionListDescription>{usageStr}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Service level</DescriptionListTerm>
                <DescriptionListDescription>{serviceLevelStr}</DescriptionListDescription>
                {isEditViewable && (
                  <DescriptionListDescription>
                    {canSubscribeOCP ? (
                      <Button variant="link" isInline onClick={handleEditSettings}>Edit subscription settings</Button>
                    ) : (
                      <>
                        <a href={salesURL} target="_blank" rel="noreferrer noopener">Contact sales</a>
                        {' to purchase an OpenShift subscription.'}
                      </>
                    )}
                  </DescriptionListDescription>
                )}
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
          <GridItem md={6}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Subscription units</DescriptionListTerm>
                <DescriptionListDescription>{systemUnitsStr}</DescriptionListDescription>
              </DescriptionListGroup>
              {false && ( // TODO: either add back or remove PRODUCT_BUNDLE
                <>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Subscription product</DescriptionListTerm>
                    <DescriptionListDescription>{productBundleStr}</DescriptionListDescription>
                  </DescriptionListGroup>
                </>
              )}
              <DescriptionListGroup>
                <DescriptionListTerm>Subscription obligation</DescriptionListTerm>
                <DescriptionListDescription>{obligationStr}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
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
