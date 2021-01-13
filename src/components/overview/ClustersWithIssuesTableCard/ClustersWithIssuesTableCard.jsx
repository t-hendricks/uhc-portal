import PropTypes from 'prop-types';
import React from 'react';
import {
  CardBody,
  Card,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody, CardTitle,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
  textCenter,
  TableVariant,
} from '@patternfly/react-table';
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
    const {
      unhealthyClusters, setClusterDetails, viewOptions,
    } = this.props;
    if (unhealthyClusters.fulfilled && unhealthyClusters.clusters.length === 0) {
      return (
        <Card className="clusters-overview-card">
          <CardTitle>
            Clusters with issues
          </CardTitle>
          <CardBody>
            <EmptyState>
              <EmptyStateIcon icon={CheckCircleIcon} color={global_success_color_100.value} />
              <EmptyStateBody>
                No issues detected
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      );
    }

    const clusterWithIssuesRow = (cluster) => {
      const issuesCount = (
        <span>
          {getIssuesCount(cluster)}
        </span>
      );

      const clusterName = (
        <Link to={`/details/${cluster.id}`} onClick={() => setClusterDetails(cluster)}>
          {getClusterName(cluster)}
        </Link>
      );

      return {
        cells: [
          { title: clusterName },
          { title: issuesCount },
        ],
        cluster,
      };
    };

    const columns = [
      { title: 'Name', transforms: [cellWidth(30)] },
      { title: 'Issues detected', transforms: [textCenter, cellWidth(15)], columnTransforms: [textCenter] },
    ];

    const showSkeleton = unhealthyClusters.pending
      && (unhealthyClusters.clusters && unhealthyClusters.clusters.length > 0);

    const rows = showSkeleton ? skeletonRows(viewOptions.pageSize)
      : unhealthyClusters.clusters.map(cluster => clusterWithIssuesRow(cluster));
    const resolver = unhealthyClusters.pending ? undefined
      : rowData => actionResolver(rowData.cluster);

    return (
      <Card className="clusters-overview-card">
        <CardTitle>
          Clusters with issues
        </CardTitle>
        <CardBody>
          <Table
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
    clusters: PropTypes.array,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  viewOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  setClusterDetails: PropTypes.func.isRequired,
  getUnhealthyClusters: PropTypes.func.isRequired,
};

export default ClustersWithIssuesTableCard;
