import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';
import OSDSubscriptionTable from './OSDSubscriptionTable';

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
    const { quotaCost } = this.props;
    let content;
    if (quotaCost.fulfilled) {
      const rows = quotaCost.items.map(quotaItem => [
        get(quotaItem, 'related_resources[0].resource_type'),
        get(quotaItem, 'related_resources[0].resource_name'),
        { title: this.getZoneType(get(quotaItem, 'related_resources[0].availability_zone_type')) },
        this.getPlanType(get(quotaItem, 'related_resources[0].byoc')),
        startCase(get(quotaItem, 'related_resources[0].product')),
        `${quotaItem.consumed} of ${quotaItem.allowed}`,
        { title: this.getCapacityIcon(quotaItem.consumed, quotaItem.allowed) },
      ]);
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
      content = <SubscriptionNotFulfilled data={data} refresh={this.refresh} />;
    }

    return (
      <Card>
        <CardTitle>OpenShift Dedicated</CardTitle>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              The summary of all subscriptions for OpenShift Dedicated purchased
              by your organization or granted by Red Hat.
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
