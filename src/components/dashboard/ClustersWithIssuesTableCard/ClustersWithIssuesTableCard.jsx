import PropTypes from 'prop-types';
import React from 'react';
import {
  CardBody,
  Card,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  CardTitle,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, textCenter, TableVariant } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@patternfly/react-icons';
import {
  // eslint-disable-next-line camelcase
  global_success_color_100,
} from '@patternfly/react-tokens';
import getClusterName from '../../../common/getClusterName';
import { getIssuesCount } from '../overviewHelpers';
import { actionResolver } from './ClustersWithIssuesActionResolver';
import skeletonRows from '../../common/SkeletonRows';
import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import { viewConstants } from '../../../redux/constants';
import { viewPropsChanged, createOverviewQueryObject } from '../../../common/queryHelpers';

class ClustersWithIssuesTableCard extends React.Component {
  componentDidUpdate(prevProps) {
    const { getUnhealthyClusters, viewOptions } = this.props;
    if (viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      getUnhealthyClusters(createOverviewQueryObject(viewOptions));
    }
  }

  render() {
    const { unhealthyClusters, viewOptions } = this.props;
    if (unhealthyClusters.fulfilled && unhealthyClusters.subscriptions.length === 0) {
      return (
        <Card className="ocm-overview-clusters__card">
          <CardTitle>Clusters with issues</CardTitle>
          <CardBody>
            <EmptyState>
              <EmptyStateIcon icon={CheckCircleIcon} color={global_success_color_100.value} />
              <EmptyStateBody>No issues detected</EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      );
    }

    const clusterWithIssuesRow = (subscription) => {
      const issuesCount = <span>{getIssuesCount(subscription)}</span>;

      const clusterName = (
        <Link to={`/details/s/${subscription.id}`}>{getClusterName(subscription)}</Link>
      );

      return {
        cells: [{ title: clusterName }, { title: issuesCount }],
        subscription,
      };
    };

    const columns = [
      { title: 'Name' },
      { title: 'Issues detected', transforms: [textCenter], columnTransforms: [textCenter] },
    ];

    const showSkeleton =
      unhealthyClusters.pending &&
      unhealthyClusters.subscriptions &&
      unhealthyClusters.subscriptions.length > 0;

    const rows = showSkeleton
      ? skeletonRows(viewOptions.pageSize)
      : unhealthyClusters.subscriptions.map((subscription) => clusterWithIssuesRow(subscription));
    const resolver = unhealthyClusters.pending
      ? undefined
      : (rowData) => actionResolver(rowData.subscription);

    return (
      <Card className="ocm-overview-clusters__card">
        <CardTitle>Clusters with issues</CardTitle>
        <CardBody>
          <Table
            className="clusters-with-issues"
            aria-label="Clusters with issues"
            cells={columns}
            rows={rows}
            actionResolver={resolver}
            variant={TableVariant.compact}
          >
            <TableHeader />
            <TableBody />
          </Table>
          <ViewPaginationRow
            viewType={viewConstants.OVERVIEW_VIEW}
            currentPage={viewOptions.currentPage}
            pageSize={viewOptions.pageSize}
            totalCount={viewOptions.totalCount}
            totalPages={viewOptions.totalPages}
            variant="bottom"
          />
        </CardBody>
      </Card>
    );
  }
}

ClustersWithIssuesTableCard.propTypes = {
  unhealthyClusters: PropTypes.shape({
    subscriptions: PropTypes.array,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  viewOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  getUnhealthyClusters: PropTypes.func.isRequired,
};

export default ClustersWithIssuesTableCard;
