import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import {
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import { usePreviousProps } from '~/hooks/usePreviousProps';

import { createOverviewQueryObject, viewPropsChanged } from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';
import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import modals from '../../common/Modal/modals';
import skeletonRows from '../../common/SkeletonRows';

import { expiredTrialsFilter } from './expiredTrialsHelpers';

const ExpiredTrialsCard = (props) => {
  const { getSubscriptions, subscriptions, viewOptions, openModal } = props;
  React.useEffect(() => {
    if (!subscriptions.fulfilled && !subscriptions.pending) {
      getSubscriptions(createOverviewQueryObject(viewOptions, expiredTrialsFilter));
    }
  }, [getSubscriptions, subscriptions, viewOptions]);

  const prevProps = usePreviousProps(props);

  React.useEffect(() => {
    if (
      (!subscriptions.pending && !subscriptions.valid) ||
      (prevProps && viewPropsChanged(viewOptions, prevProps.viewOptions))
    ) {
      getSubscriptions(createOverviewQueryObject(viewOptions, expiredTrialsFilter));
    }
  }, [prevProps, getSubscriptions, subscriptions, viewOptions]);

  if (subscriptions.error) {
    return (
      <Card className="ocm-overview-clusters__card">
        <CardTitle>Expired Trials</CardTitle>
        <CardBody>
          <EmptyState>
            <EmptyStateHeader titleText="No data available" headingLevel="h2" />
            <EmptyStateBody>
              There was an error fetching the data. Try refreshing the page.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  if (!subscriptions.items || subscriptions.items.length === 0) {
    return null;
  }
  const expiredTrialRow = (subscription) => {
    const name = subscription.display_name || subscription.external_cluster_id;

    const clusterName = <Link to={`/details/s/${subscription.id}`}>{name}</Link>;

    return {
      cells: [{ title: clusterName }],
      subscription,
    };
  };

  const columns = [{ title: 'Name' }];

  const actionResolver = ({ subscription }) => [
    {
      title: 'Edit subscription settings',
      onClick: () => openModal('edit-subscription-settings', { subscription }),
    },
    {
      title: 'Archive cluster',
      onClick: () =>
        openModal(modals.ARCHIVE_CLUSTER, {
          subscriptionID: subscription.id,
          name: subscription.display_name || subscription.external_cluster_id,
        }),
    },
  ];

  const areActionsDisabled = ({ subscription }) => !subscription.canEdit;

  const showSkeleton =
    subscriptions.pending && subscriptions.items && subscriptions.items.length > 0;

  const rows = showSkeleton
    ? skeletonRows(viewOptions.pageSize)
    : subscriptions.items.map((subscription) => expiredTrialRow(subscription));

  return (
    <Card className="ocm-overview-clusters__card">
      <CardTitle>Expired Trials</CardTitle>
      <CardBody>
        <TableDeprecated
          aria-label="Expired Trials"
          cells={columns}
          rows={rows}
          variant={TableVariant.compact}
          actionResolver={showSkeleton ? undefined : actionResolver}
          areActionsDisabled={areActionsDisabled}
        >
          <TableHeaderDeprecated />
          <TableBodyDeprecated />
        </TableDeprecated>
        <ViewPaginationRow
          viewType={viewConstants.OVERVIEW_EXPIRED_TRIALS}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
          variant="bottom"
          isDisabled={subscriptions.pending}
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '25', value: 25 },
            { title: '50', value: 50 },
          ]}
        />
      </CardBody>
    </Card>
  );
};

ExpiredTrialsCard.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  subscriptions: PropTypes.object.isRequired,
  viewOptions: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default ExpiredTrialsCard;
