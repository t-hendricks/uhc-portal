import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
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

  render() {
    const { quotaSummary } = this.props;

    let content;
    if (quotaSummary.fulfilled) {
      const rows = quotaSummary.items.map(quotaItem => [
        quotaItem.resource_type,
        quotaItem.resource_name,
        `${quotaItem.availability_zone_type}-zone`,
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
      quotaSummary.type = 'osd';
      quotaSummary.empty = true;
      content = <SubscriptionNotFulfilled data={quotaSummary} refresh={this.refresh} />;
    }

    return (
      <Card>
        <CardHeader className="section-header">OpenShift Dedicated</CardHeader>
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
