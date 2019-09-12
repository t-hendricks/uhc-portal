import PropTypes from 'prop-types';
import React, { Component } from 'react';
import countBy from 'lodash/countBy';
import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';

import {
  SUBSCRIPTION_ARCHIVED,
  SUBSCRIPTION_DEPROVISIONED,
  ENTITLEMENT_OK,
  ENTITLEMENT_NOT_SET,
  ENTITLEMENT_OVERCOMMITTED,
  ENTITLEMENT_INCONSISTENT_SERVICES,
} from '../../../common/subscriptionTypes';
import SubscriptionNotFulfilled from '../SubscriptionNotFulfilled';
import OCPSubscriptionSummary from './OCPSubscriptionSummary';


class OCPSubscriptionCard extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { organizationID, fetchSubscriptions } = this.props;
    const search = [
      `status NOT IN ('${SUBSCRIPTION_ARCHIVED}','${SUBSCRIPTION_DEPROVISIONED}')`,
      "managed = 'FALSE'",
      `organization_id='${organizationID}'`,
    ];
    fetchSubscriptions({
      search: search.join(' AND '),
      size: -1,
    });
  }

  render() {
    const { organizationID, subscriptions } = this.props;

    let content;
    if (subscriptions.fulfilled) {
      const inputStats = countBy(subscriptions.items, 'entitlement_status');
      const stats = Object.assign({
        [ENTITLEMENT_OK]: 0,
        [ENTITLEMENT_NOT_SET]: 0,
        [ENTITLEMENT_OVERCOMMITTED]: 0,
        [ENTITLEMENT_INCONSISTENT_SERVICES]: 0,
      }, inputStats);
      content = <OCPSubscriptionSummary stats={stats} organizationID={organizationID} />;
    } else {
      subscriptions.type = 'ocp';
      subscriptions.empty = true;
      content = <SubscriptionNotFulfilled data={subscriptions} refresh={this.refresh} />;
    }

    return (
      <Card>
        <CardHeader>OpenShift Container Platform</CardHeader>
        <CardBody>
        The summary of subscription status for all self-managed clusters.
        Please follow the individual links to see the specific clusters
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
