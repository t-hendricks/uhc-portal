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
import ExternalLink from '../../common/ExternalLink';

import { billingModels } from '../../../common/subscriptionTypes';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';
import OSDSubscriptionTable from './OSDSubscriptionTable';

const { MARKETPLACE } = billingModels;

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
    if (zoneType === 'multi') { return 'multi-zone'; }
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
    const { quotaCost, marketplace } = this.props;
    let content;
    let rows = [];

    let subscriptionLink = (
      <Link to="/quota/resource-limits">
        Dedicated (On-Demand Limits)
      </Link>
    );
    let subscriptionsDescription = 'The summary of all annual subscriptions for OpenShift Dedicated purchased by your organization or granted by Red Hat. For On-Demand resources, see';
    if (marketplace) {
      // add link
      subscriptionLink = (
        <ExternalLink href="/openshift/subscriptions/openshift-dedicated" noIcon>
          Dedicated (On-Demand)
        </ExternalLink>
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

        // For summit
        // filter out non-marketplace quota when on the marketplace subscriptions page
        // and explicitly allow addon-open-data-hub on the marketplace quota page
        const billingModel = get(relatedResources[0], 'billing_model');
        let resourceName = get(relatedResources[0], 'resource_name');
        if (marketplace && billingModel !== MARKETPLACE) {
          if (resourceName !== 'addon-open-data-hub') {
            return [];
          }
        }
        if (!marketplace && (billingModel === MARKETPLACE || resourceName === 'addon-open-data-hub')) {
          return [];
        }

        // CCS compute.node resource name should show as vCPU
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
              {' '}
              {subscriptionLink}
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
  marketplace: PropTypes.bool,
};

export default OSDSubscriptionCard;
