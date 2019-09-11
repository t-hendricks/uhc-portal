import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import forOwn from 'lodash/forOwn';
import {
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';

import {
  ENTITLEMENT_OK,
  ENTITLEMENT_NOT_SET,
  ENTITLEMENT_OVERCOMMITTED,
  ENTITLEMENT_INCONSISTENT_SERVICES,
} from '../../../common/subscriptionTypes';
import { buildUrlParams } from '../../../common/helpers';
import PopoverHint from '../../common/PopoverHint';


function OCPSubscriptionSummary({ stats, organizationID }) {
  const links = {};
  forOwn(stats, (numClusters, entitlementStatus) => {
    const params = { entitlement_status: entitlementStatus, organization_id: organizationID, managed: 'false' };
    links[entitlementStatus] = (
      <Link to={{ pathname: '/', search: buildUrlParams(params) }}>
        {`${numClusters} Cluster${numClusters === 1 ? '' : 's'}`}
      </Link>
    );
  });

  return (
    <>
      <h4>Subscription Status</h4>
      <Stack className="status-group">
        <StackItem className="status-label ok-label">
          <CheckCircleIcon className="status-icon ok-icon" />
          Properly entitled
        </StackItem>
        <StackItem>
          {links[ENTITLEMENT_OK]}
        </StackItem>
      </Stack>
      <Stack className="status-group">
        <StackItem className="status-label warn-label">
          <ExclamationTriangleIcon className="status-icon warn-icon" />
          Subscription issues
        </StackItem>
        <StackItem>
          Not subscribed
          <PopoverHint hint="Clusters do not have subscriptions attached." />
        </StackItem>
        <StackItem>
          {links[ENTITLEMENT_NOT_SET]}
        </StackItem>
      </Stack>
      <Stack className="status-group">
        <StackItem>
          Insufficient
          <PopoverHint hint="Clusters are consuming more resources than they are entitled to." />
        </StackItem>
        <StackItem>
          {links[ENTITLEMENT_OVERCOMMITTED]}
        </StackItem>
      </Stack>
      <Stack className="status-group">
        <StackItem>
          Invalid
          <PopoverHint hint="Clusters are attached to subscriptions with different support levels." />
        </StackItem>
        <StackItem>
          {links[ENTITLEMENT_INCONSISTENT_SERVICES]}
        </StackItem>
      </Stack>
    </>
  );
}

OCPSubscriptionSummary.propTypes = {
  stats: PropTypes.object.isRequired,
  organizationID: PropTypes.string.isRequired,
};

export default OCPSubscriptionSummary;
