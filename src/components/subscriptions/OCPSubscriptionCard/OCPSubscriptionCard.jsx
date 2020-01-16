import PropTypes from 'prop-types';
import React, { Component } from 'react';
import countBy from 'lodash/countBy';
import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';

import { subscriptionStatuses, entitlementStatuses } from '../../../common/subscriptionTypes';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';
import OCPSubscriptionSummary from './OCPSubscriptionSummary';


class OCPSubscriptionCard extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { organizationID, fetchSubscriptions } = this.props;
    const search = [
      `status NOT IN ('${subscriptionStatuses.ARCHIVED}','${subscriptionStatuses.DEPROVISIONED}')`,
      "managed = 'FALSE'",
      `organization_id='${organizationID}'`,
    ];
    fetchSubscriptions({
      search: search.join(' AND '),
      size: -1,
    });
  }

  render() {
    const { subscriptions } = this.props;

    let content;
    if (subscriptions.fulfilled) {
      const inputStats = countBy(subscriptions.items, 'entitlement_status');
      const stats = {
        [entitlementStatuses.OK]: 0,
        [entitlementStatuses.NOT_SUBSCRIBED]: 0,
        [entitlementStatuses.OVERCOMMITTED]: 0,
        [entitlementStatuses.INCONSISTENT_SERVICES]: 0,
        [entitlementStatuses.SIXTY_DAY_EVALUATION]: 0,
        ...inputStats,
      };
      content = <OCPSubscriptionSummary stats={stats} />;
    } else {
      subscriptions.type = 'ocp';
      subscriptions.empty = true;
      content = <SubscriptionNotFulfilled data={subscriptions} refresh={this.refresh} />;
    }

    return (
      <Card>
        <CardHeader className="section-header">OpenShift Container Platform</CardHeader>
        <CardBody className="section-text">
        The summary of subscription status for all self-managed clusters.
        Follow the individual links to see the specific clusters
        in each of the corresponding status.
        </CardBody>
        <CardBody>
          { content }
        </CardBody>
      </Card>
    );
  }
}

OCPSubscriptionCard.propTypes = {
  organizationID: PropTypes.string.isRequired,
  fetchSubscriptions: PropTypes.func.isRequired,
  subscriptions: PropTypes.object.isRequired,
};

export default OCPSubscriptionCard;
