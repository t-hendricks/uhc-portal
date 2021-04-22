import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import startCase from 'lodash/startCase';
import {
  Card,
  CardBody,
  CardTitle,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
  ResourcesAlmostEmptyIcon,
  ResourcesAlmostFullIcon,
  ResourcesFullIcon,
  OutlinedCircleIcon,
} from '@patternfly/react-icons';

import { billingModels } from '../../../common/subscriptionTypes';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';
import OSDSubscriptionTable from './OSDSubscriptionTable';

const { MARKETPLACE, STANDARD } = billingModels;

class OSDSubscriptionCard extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { organizationID, fetchQuotaCost } = this.props;
    fetchQuotaCost(organizationID);
  }

  getCapacityIcon = (used, max) => {
    let icon = <ResourcesAlmostEmptyIcon />;
    if (used > max) {
      icon = <ExclamationTriangleIcon className="warn-icon" />;
    } else if (used === max) {
      icon = <ResourcesFullIcon />;
    } else if (used >= max / 2) {
      icon = <ResourcesAlmostFullIcon />;
    } else if (used === 0) {
      icon = <OutlinedCircleIcon />;
    }
    return icon;
  }

  getZoneType = (zoneType) => {
    if (zoneType === 'multi') { return 'multizone'; }
    if (zoneType === 'single') { return 'single zone'; }
    return 'N/A';
  }

  getPlanType = (byoc) => {
    if (byoc === 'rhinfra') { return 'Standard'; }
    if (byoc === 'byoc') { return 'CCS'; }
    if (byoc === 'any') { return 'Any'; }
    return 'N/A';
  }

  render() {
    // quota resource limits displays on demand marketplace quota
    const marketplace = window.location.pathname.includes('/quota/resource-limits');
    const { quotaCost } = this.props;
    let content;
    let rows = [];

    let subscriptionsDescription = 'The summary of all subscriptions for OpenShift Dedicated purchased by your organization or granted by Red Hat.';
    let subscriptionLink;
    if (marketplace) {
      // add link
      subscriptionLink = (
        <Link to="/quota">
          Dedicated (On-Demand)
        </Link>
      );
      subscriptionsDescription = 'Active subscriptions allow your organization to use up to a certain number of OpenShift Dedicated clusters. Overall OSD subscription capacity and usage can be viewed in';
    }

    if (quotaCost.fulfilled) {
      rows = quotaCost.items.flatMap((quotaItem) => {
        // filter out quota you neither have nor consume
        if (quotaItem.consumed === 0 && quotaItem.allowed === 0) {
          return [];
        }

        // filter out zero cost related resources
        const relatedResources = get(quotaItem, 'related_resources', []).filter(resource => resource.cost !== 0);
        if (relatedResources.length === 0) {
          return [];
        }

        // filter out non-marketplace quota when on the marketplace subscriptions page
        const billingModel = get(relatedResources[0], 'billing_model');
        if (marketplace && billingModel === STANDARD) {
          return [];
        }
        if (!marketplace && billingModel === MARKETPLACE) {
          return [];
        }

        // CCS compute.node resource name should show as vCPU
        let resourceName = get(relatedResources[0], 'resource_name');
        if (get(relatedResources[0], 'resource_type') === 'compute.node' && get(relatedResources[0], 'byoc') === 'byoc') {
          resourceName = 'vCPU';
        }

        return [[
          get(relatedResources[0], 'resource_type'),
          resourceName,
          { title: this.getZoneType(get(relatedResources[0], 'availability_zone_type')) },
          this.getPlanType(get(relatedResources[0], 'byoc')),
          startCase(get(relatedResources[0], 'product')),
          `${quotaItem.consumed} of ${quotaItem.allowed}`,
          { title: this.getCapacityIcon(quotaItem.consumed, quotaItem.allowed) },
        ]];
      });
    }

    // all rows may be filtered out if a user doesn't have any quota
    if (rows.length > 0) {
      content = (
        <>
          <StackItem className="content-header">
            Quota
          </StackItem>
          <StackItem className="table-container">
            <OSDSubscriptionTable rows={rows} />
          </StackItem>
        </>
      );
    } else {
      const data = {
        error: quotaCost.error,
        pending: quotaCost.pending,
        type: 'osd',
        empty: true,
      };
      content = (
        <SubscriptionNotFulfilled
          data={data}
          refresh={this.refresh}
          marketplace={marketplace}
        />
      );
    }

    return (
      <Card>
        <CardTitle>OpenShift Dedicated</CardTitle>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              {subscriptionsDescription}
              {marketplace && ' '}
              {marketplace && (
                subscriptionLink
              )}
            </StackItem>
            {content}
          </Stack>
        </CardBody>
      </Card>
    );
  }
}

OSDSubscriptionCard.propTypes = {
  organizationID: PropTypes.string.isRequired,
  fetchQuotaCost: PropTypes.func.isRequired,
  quotaCost: PropTypes.object.isRequired,
};

export default OSDSubscriptionCard;
