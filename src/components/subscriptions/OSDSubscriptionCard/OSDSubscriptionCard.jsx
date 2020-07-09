import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Card,
  CardBody, CardTitle,
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
    const { organizationID, fetchQuotaSummary } = this.props;
    fetchQuotaSummary(organizationID);
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

  render() {
    const { quotaSummary } = this.props;
    let content;
    if (quotaSummary.fulfilled) {
      const rows = quotaSummary.items.map(quotaItem => [
        quotaItem.resource_type,
        quotaItem.resource_name,
        { title: this.getZoneType(quotaItem.availability_zone_type) },
        quotaItem.byoc ? 'BYOC' : 'Standard',
        quotaItem.reserved,
        quotaItem.allowed,
        { title: this.getCapacityIcon(quotaItem.reserved, quotaItem.allowed) },
      ]);
      content = (
        <>
          <h4 className="content-header">Quota</h4>
          <OSDSubscriptionTable rows={rows} />
        </>
      );
    } else {
      const data = {
        error: quotaSummary.error,
        pending: quotaSummary.pending,
        type: 'osd',
        empty: true,
      };
      content = <SubscriptionNotFulfilled data={data} refresh={this.refresh} />;
    }

    return (
      <Card>
        <CardTitle className="section-header">OpenShift Dedicated</CardTitle>
        <CardBody className="section-text">
        The summary of all subscriptions for OpenShift Dedicated
        purchased by your organization or granted by Red Hat.
        </CardBody>
        <CardBody className="osd-table-container">
          {content}
        </CardBody>
      </Card>
    );
  }
}

OSDSubscriptionCard.propTypes = {
  organizationID: PropTypes.string.isRequired,
  fetchQuotaSummary: PropTypes.func.isRequired,
  quotaSummary: PropTypes.object.isRequired,
};

export default OSDSubscriptionCard;
