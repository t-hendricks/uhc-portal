import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
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

import { useGlobalState } from '~/redux/hooks';
import { getSubscriptionQueryType } from '~/services/accountsService';
import { Subscription } from '~/types/accounts_mgmt.v1';
import { SubscriptionWithPermissions } from '~/types/types';

import { createOverviewQueryObject, viewPropsChanged } from '../../../common/queryHelpers';
import { getSubscriptions } from '../../../redux/actions/subscriptionsActions';
import { viewConstants } from '../../../redux/constants';
import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import { openModal } from '../../common/Modal/ModalActions';
import modals from '../../common/Modal/modals';
import skeletonRows from '../../common/SkeletonRows';

import { expiredTrialsFilter } from './expiredTrialsHelpers';

const ExpiredTrialsCard = () => {
  const dispatch = useDispatch();

  const subscriptionsState = useGlobalState((state) => state.subscriptions.subscriptions);
  const viewOptions = useGlobalState(
    (state) => state.viewOptions[viewConstants.OVERVIEW_EXPIRED_TRIALS],
  );
  const [prevViewOptions, setPrevViewOptions] = useState(viewOptions);
  const showSkeleton = useMemo(
    () =>
      subscriptionsState.pending && subscriptionsState.items && subscriptionsState.items.length > 0,
    [subscriptionsState.items, subscriptionsState.pending],
  );
  const rows = useMemo(
    () =>
      showSkeleton
        ? skeletonRows(viewOptions.pageSize)
        : subscriptionsState.items?.map((subscription) => ({
            cells: [
              {
                title: (
                  <Link to={`/details/s/${subscription.id}`}>
                    {subscription.display_name || subscription.external_cluster_id}
                  </Link>
                ),
              },
            ],
            subscription,
          })),
    [showSkeleton, subscriptionsState.items, viewOptions.pageSize],
  );

  useEffect(() => {
    if (!subscriptionsState.fulfilled && !subscriptionsState.pending) {
      dispatch(
        getSubscriptions(
          createOverviewQueryObject(viewOptions, expiredTrialsFilter) as getSubscriptionQueryType,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, subscriptionsState.fulfilled, subscriptionsState.pending]);

  useEffect(() => {
    if (
      (!subscriptionsState.pending && !subscriptionsState.valid) ||
      viewPropsChanged(viewOptions, prevViewOptions)
    ) {
      dispatch(
        getSubscriptions(
          createOverviewQueryObject(viewOptions, expiredTrialsFilter) as getSubscriptionQueryType,
        ),
      );
      setPrevViewOptions(viewOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionsState.pending, subscriptionsState.valid, viewOptions, dispatch]);

  const actionResolver = ({ subscription }: { subscription: Subscription }) => [
    {
      title: 'Edit subscription settings',
      onClick: () => dispatch(openModal(modals.EDIT_SUBSCRIPTION_SETTINGS, { subscription })),
    },
    {
      title: 'Archive cluster',
      onClick: () =>
        dispatch(
          openModal(modals.ARCHIVE_CLUSTER, {
            subscriptionID: subscription.id,
            name: subscription.display_name || subscription.external_cluster_id,
          }),
        ),
    },
  ];

  if (subscriptionsState.error) {
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

  return !subscriptionsState.items || subscriptionsState.items.length === 0 ? null : (
    <Card className="ocm-overview-clusters__card">
      <CardTitle>Expired Trials</CardTitle>
      <CardBody>
        <TableDeprecated
          aria-label="Expired Trials"
          cells={[{ title: 'Name' }]}
          rows={rows}
          variant={TableVariant.compact}
          actionResolver={(rowData) =>
            showSkeleton
              ? []
              : actionResolver(rowData as { subscription: SubscriptionWithPermissions })
          }
          areActionsDisabled={(rowData) => rowData.subscription && !rowData.subscription.canEdit}
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
          isDisabled={subscriptionsState.pending}
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

export default ExpiredTrialsCard;
