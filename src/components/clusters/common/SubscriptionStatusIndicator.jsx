import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Popover, PopoverPosition, Button } from '@patternfly/react-core';
import { CheckCircleIcon, WarningTriangleIcon, UnknownIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_success_color_100, global_warning_color_100 } from '@patternfly/react-tokens';

function SubscriptionStatusIndicator({ cluster }) {
  const managed = get(cluster, 'managed');
  const entitlementStatus = get(cluster, 'subscription.entitlement_status');

  switch (entitlementStatus) {
    case 'Ok':
      return (
        <React.Fragment>
          <CheckCircleIcon color={global_success_color_100.value} />
          {' '}
          Subscribed
        </React.Fragment>
      );
    case 'Valid':
      return (
        <React.Fragment>
          <CheckCircleIcon color={global_success_color_100.value} />
          {' '}
          Valid
        </React.Fragment>
      );
    case 'NotSet':
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster does not have a subscription attached."
          aria-label="Not Subscribed"
        >
          <Button variant="link" isInline icon={<WarningTriangleIcon color={global_warning_color_100.value} />}>
            Not Subscribed
          </Button>
        </Popover>
      );
    case 'Overcommitted':
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster is consuming more resources than it is entitled to."
          aria-label="Insufficient"
        >
          <Button variant="link" isInline icon={<WarningTriangleIcon color={global_warning_color_100.value} />}>
            Insufficient
          </Button>
        </Popover>
      );
    case 'InconsistentServices':
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="This cluster is attached to subscriptions with different support levels."
          aria-label="Invalid"
        >
          <Button variant="link" isInline icon={<WarningTriangleIcon color={global_warning_color_100.value} />}>
            Invalid
          </Button>
        </Popover>
      );
    default:
      if (managed) {
        return (
          <React.Fragment>
            <CheckCircleIcon color={global_success_color_100.value} />
            {' '}
            Subscribed
          </React.Fragment>
        );
      }
      return (
        <Popover
          position={PopoverPosition.top}
          bodyContent="Subscription information for this cluster is not available yet. It may take up to 12 hours for this information to become available."
          aria-label="Unknown"
        >
          <Button variant="link" isInline icon={<UnknownIcon color="black" />}>
            Unknown
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
  }),
};

export default SubscriptionStatusIndicator;
