import PropTypes from 'prop-types';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
  textCenter,
} from '@patternfly/react-table';
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';
import { Link } from 'react-router-dom';
import getClusterName from '../../common/getClusterName';
import { getIssuesCount } from './overviewHelpers';
import { actionResolver } from './ClustersWithIssuesActionResolver';

function ClustersWithIssuesTable(props) {
  const {
    clusters, isPending, setClusterDetails,
  } = props;
  if (!isPending && (!clusters || clusters.length === 0)) {
    return <p className="notfound">No results match the filter criteria.</p>;
  }

  const skeletonRows = () => {
    const row = {
      cells: [
        {
          props: { colSpan: 6 },
          title: <Skeleton size="lg" />,
        },
      ],
    };
    const ret = [];
    for (let i = 0; i < 10; i += 1) {
      ret.push(row);
    }
    return ret;
  };

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

  const rows = isPending ? skeletonRows() : clusters.map(cluster => clusterWithIssuesRow(cluster));
  const resolver = isPending ? undefined
    : rowData => actionResolver(rowData.cluster);

  return (
    <Table
      aria-label="Clusters with issues"
      cells={columns}
      rows={rows}
      actionResolver={resolver}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ClustersWithIssuesTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  isPending: PropTypes.bool,
  setClusterDetails: PropTypes.func.isRequired,
};

export default ClustersWithIssuesTable;
