import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Popover, PopoverPosition, Button } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_success_color_100, global_warning_color_100 } from '@patternfly/react-tokens';
import { entitlementStatuses } from '../../../../common/subscriptionTypes';
import getClusterEvaluationExpiresInDays from '../../../../common/getClusterEvaluationExpiresInDays';

function SubscriptionStatusIndicator({ cluster }) {
  const managed = get(cluster, 'managed');
  const entitlementStatus = get(cluster, 'subscription.entitlement_status');
  const evaluationExpiresStr = getClusterEvaluationExpiresInDays(cluster);

  switch (entitlementStatus) {
    case entitlementStatuses.OK:
      return (
        <>
          <CheckCircleIcon color={global_success_color_100.value} />
          {' '}
          Subscribed
        </>
      );
    case entitlementStatuses.OVERCOMMITTED:
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster is consuming more resources than it is entitled to."
          aria-label="Insufficient"
        >
          <Button variant="link" isInline icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}>
            Insufficient
          </Button>
        </Popover>
      );
    case entitlementStatuses.INCONSISTENT_SERVICES:
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster is attached to subscriptions with different support levels."
          aria-label="Invalid"
        >
          <Button variant="link" isInline icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}>
            Invalid
          </Button>
        </Popover>
      );
    case entitlementStatuses.SIXTY_DAY_EVALUATION:
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent={`${evaluationExpiresStr} remaining in the evaluation period.`}
          aria-label="Six Day Evaluation"
        >
          <Button variant="link" isInline icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}>
            60-day evaluation
          </Button>
        </Popover>
      );
    default:
      if (managed) {
        return (
          <>
            <CheckCircleIcon color={global_success_color_100.value} />
            {' '}
            Subscribed
          </>
        );
      }
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster does not have a subscription attached."
          aria-label="Not Subscribed"
        >
          <Button variant="link" isInline icon={<ExclamationTriangleIcon color={global_warning_color_100.value} />}>
            Not subscribed
          </Button>
        </Popover>
      );
  }
}

SubscriptionStatusIndicator.propTypes = {
  cluster: PropTypes.shape({
    managed: PropTypes.bool,
    subscription: PropTypes.shape({
      entitlement_status: PropTypes.string,
    }),
    creation_timestamp: PropTypes.string,
  }),
};

export default SubscriptionStatusIndicator;
