import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';

import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';


import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import { viewConstants } from '../../../redux/constants';
import { viewPropsChanged, createOverviewQueryObject } from '../../../common/queryHelpers';
import { subscriptionSupportLevels } from '../../../common/subscriptionTypes';

import skeletonRows from '../../common/SkeletonRows';


const filter = { filter: `support_level='${subscriptionSupportLevels.NONE}' AND status NOT IN ('Deprovisioned', 'Archived')` };

class ExpiredTrialsCard extends React.Component {
  componentDidMount() {
    const { getSubscriptions, subscriptions, viewOptions } = this.props;
    if (!subscriptions.fulfilled && !subscriptions.pending) {
      getSubscriptions(createOverviewQueryObject(viewOptions, filter));
    }
  }

  componentDidUpdate(prevProps) {
    const { getSubscriptions, subscriptions, viewOptions } = this.props;
    if ((!subscriptions.pending && !subscriptions.valid)
        || viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      getSubscriptions(createOverviewQueryObject(viewOptions, filter));
    }
  }

  render() {
    const { viewOptions, subscriptions, openModal } = this.props;
    if (!subscriptions.items) {
      return null;
    }

    const expiredTrialRow = (subscription) => {
      const name = subscription.display_name || subscription.external_cluster_id;

      const clusterName = (
        <Link to={`/details/${subscription.cluster_id}`}>{name}</Link>
      );

      return {
        cells: [
          { title: clusterName },
        ],
        subscription,
      };
    };

    const columns = [
      { title: 'Name' },
    ];

    const actionResolver = ({ subscription }) => [
      {
        title: 'Edit Subscription Settings',
        onClick: () => openModal('edit-subscription-settings', subscription),
      },
      {
        title: 'Archive Cluster',
        onClick: () => openModal('archive-cluster', {
          subscriptionID: subscription.id,
          name: subscription.display_name || subscription.external_cluster_id,
        }),
      },
    ];

    const areActionsDisabled = ({ subscription }) => !subscription.canEdit;

    const showSkeleton = subscriptions.pending
      && (subscriptions.items && subscriptions.items.length > 0);

    const rows = showSkeleton ? skeletonRows(viewOptions.pageSize)
      : subscriptions.items.map(subscription => expiredTrialRow(subscription));

    return (
      <Card id="clusters-overview-card">
        <CardHeader>
          Expired Trials
        </CardHeader>
        <CardBody>
          <Table
            aria-label="Expired Trials"
            cells={columns}
            rows={rows}
            variant={TableVariant.compact}
            actionResolver={showSkeleton ? undefined : actionResolver}
            areActionsDisabled={areActionsDisabled}
          >
            <TableHeader />
            <TableBody />
          </Table>
          <ViewPaginationRow
            viewType={viewConstants.OVERVIEW_EXPIRED_TRIALS}
            currentPage={viewOptions.currentPage}
            pageSize={viewOptions.pageSize}
            totalCount={viewOptions.totalCount}
            totalPages={viewOptions.totalPages}
            variant="bottom"
            isDisabled={subscriptions.pending}
          />
        </CardBody>
      </Card>
    );
  }
}

ExpiredTrialsCard.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  subscriptions: PropTypes.object.isRequired,
  viewOptions: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};


export default ExpiredTrialsCard;
