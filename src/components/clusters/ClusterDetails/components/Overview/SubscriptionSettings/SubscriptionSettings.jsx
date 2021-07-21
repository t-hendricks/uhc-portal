import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Alert,
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
  subscriptionServiceLevels,
  subscriptionSystemUnits,
  subscriptionStatuses,
  subscriptionSettings,
  normalizedProducts,
  billingModels,
} from '../../../../../../common/subscriptionTypes';

import ExternalLink from '../../../../../common/ExternalLink';

function SubscriptionSettings({
  subscription, openModal,
  canEdit = false, canSubscribeOCP = false,
}) {
  const product = get(subscription, 'plan.type');
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
  const billingModel = get(subscription, subscriptionSettings.CLUSTER_BILLING_MODEL);
  let billingModelStr = 'Not set';
  if (billingModel === billingModels.STANDARD) {
    billingModelStr = 'Annual: Fixed capacity subscription from Red Hat';
  } else if (billingModel === billingModels.MARKETPLACE) {
    billingModelStr = 'On-demand (Hourly)';
  }
  const usageStr = get(subscription, subscriptionSettings.USAGE, 'Not set');
  const serviceLevel = get(subscription, subscriptionSettings.SERVICE_LEVEL);
  let serviceLevelStr = 'Not set';
  if (serviceLevel === subscriptionServiceLevels.L1_L3) {
    serviceLevelStr = 'Red Hat support (L1-L3)';
  } else if (serviceLevel === subscriptionServiceLevels.L3_ONLY) {
    serviceLevelStr = 'Partner support (L3)';
  }
  const cpuTotal = get(subscription, subscriptionSettings.CPU_TOTAL, undefined);
  const cpuTotalStr = `${cpuTotal} core${cpuTotal === 1 ? '' : 's'}`;
  const socketTotal = get(subscription, subscriptionSettings.SOCKET_TOTAL, undefined);
  const socketTotalStr = `${socketTotal} socket${socketTotal === 1 ? '' : 's'}`;
  let systemUnits = get(subscription, subscriptionSettings.SYSTEM_UNITS, undefined);
  if (systemUnits === undefined) {
    if (cpuTotal !== undefined) {
      systemUnits = subscriptionSystemUnits.CORES_VCPU;
    } else if (socketTotal !== undefined) {
      systemUnits = subscriptionSystemUnits.SOCKETS;
    } else {
      systemUnits = 'Not set';
    }
  }
  let systemUnitsStr = 'Not set';
  if (systemUnits === subscriptionSystemUnits.SOCKETS && socketTotal !== undefined) {
    systemUnitsStr = 'Sockets';
  } else if (systemUnits === subscriptionSystemUnits.CORES_VCPU && cpuTotal !== undefined) {
    systemUnitsStr = 'Cores/vCPUs ';
  }
  const displayObligation = cpuTotal !== undefined || socketTotal !== undefined;
  const obligationLabel = systemUnits === subscriptionSystemUnits.SOCKETS
    ? 'Number of compute sockets' : 'Number of compute cores';
  const obligationStr = systemUnits === subscriptionSystemUnits.SOCKETS
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
      {!canSubscribeOCP && (
        <CardBody>
          <Alert
            id="subscription-settings-contact-sales-alert"
            variant="info"
            isInline
            title="Your organization doesn't have an active subscription. Purchase an OpenShift subscription by contacting sales."
          >
            <ExternalLink href={salesURL}>
              Contact sales
            </ExternalLink>
          </Alert>
        </CardBody>
      )}
      <CardBody className="ocm-c-overview-subscription-settings__card--body">
        <Grid>
          <GridItem md={6}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Subscription type</DescriptionListTerm>
                <DescriptionListDescription>{billingModelStr}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Service level agreement (SLA)</DescriptionListTerm>
                <DescriptionListDescription>{supportLevelStr}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Support type</DescriptionListTerm>
                <DescriptionListDescription>{serviceLevelStr}</DescriptionListDescription>
                {isEditViewable && (
                  <DescriptionListDescription>
                    <Button variant="link" isDisabled={!canSubscribeOCP} isInline onClick={handleEditSettings}>Edit subscription settings</Button>
                  </DescriptionListDescription>
                )}
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
          <GridItem md={6}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Cluster usage</DescriptionListTerm>
                <DescriptionListDescription>{usageStr}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Subscription units</DescriptionListTerm>
                <DescriptionListDescription>{systemUnitsStr}</DescriptionListDescription>
              </DescriptionListGroup>
              {
                displayObligation && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>{obligationLabel}</DescriptionListTerm>
                    <DescriptionListDescription>{obligationStr}</DescriptionListDescription>
                  </DescriptionListGroup>
                )
              }
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
