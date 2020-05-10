import PropTypes from 'prop-types';
import React from 'react';
import {
  CardBody,
  Card,
  CardHeader,
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
import getClusterName from '../../../common/getClusterName';
import { getIssuesCount } from '../overviewHelpers';
import { actionResolver } from './ClustersWithIssuesActionResolver';
import skeletonRows from '../../common/SkeletonRows';
import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import { viewConstants } from '../../../redux/constants';
import { viewPropsChanged, createOverviewQueryObject } from '../../../common/queryHelpers';

const CLUSTERS_STATE_UNHEALTHY = 'unhealthy';
const filter = { filter: `health_state='${CLUSTERS_STATE_UNHEALTHY}'` };

class ClustersWithIssuesTableCard extends React.Component {
  componentDidMount() {
    const { unhealthyClusters, getUnhealthyClusters, viewOptions } = this.props;
    if (!unhealthyClusters.fulfilled && !unhealthyClusters.pending) {
      getUnhealthyClusters(createOverviewQueryObject(viewOptions, filter));
    }
  }

  componentDidUpdate(prevProps) {
    const { getUnhealthyClusters, viewOptions } = this.props;
    if (viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      getUnhealthyClusters(createOverviewQueryObject(viewOptions, filter));
    }
  }

  render() {
    const {
      unhealthyClusters, setClusterDetails, viewOptions,
    } = this.props;
    if (!unhealthyClusters.pending
       && (!unhealthyClusters || unhealthyClusters.clusters.length === 0)) {
      return null;
    }

    const clusterWithIssuesRow = (cluster) => {
      const name = getClusterName(cluster);
      const issuesCount = (
        <span>
          {getIssuesCount(cluster)}
        </span>
      );

      const clusterName = (
        <Link to={`/details/${cluster.id}`} onClick={() => setClusterDetails(cluster)}>{name.trim() !== '' ? name : cluster.name}</Link>
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
        <CardHeader>
          Clusters with issues
        </CardHeader>
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
