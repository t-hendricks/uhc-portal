import result from 'lodash/result';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  classNames,
  Visibility,
  SortByDirection,
  cellWidth,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import ClusterLocationLabel from '../../../common/ClusterLocationLabel/ClusterLocationLabel';
import ClusterActionsDropdown from '../../../common/ClusterActionsDropdown';
import { getClusterStateAndDescription } from '../../../common/clusterStates';
import ClusterUpdateLink from '../../../common/ClusterUpdateLink';
import SubscriptionStatusIndicator from '../../../common/SubscriptionStatusIndicator';
import getClusterName from '../../../../../common/getClusterName';


function ClusterListTable(props) {
  const { viewOptions, setSorting } = props;
  const { clusters } = props;
  if (!clusters || clusters.length === 0) {
    return <p className="notfound">No Results Match the Filter Criteria.</p>;
  }

  const sortBy = {
    index: 0, // TODO support more fields
    direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
  };

  const onSortToggle = (_event, _index, direction) => {
    const sorting = Object.assign({}, viewOptions.sorting);
    sorting.isAscending = direction === SortByDirection.asc;
    sorting.sortField = 'name'; // TODO support more fields
    setSorting(sorting);
  };

  const clusterRow = (cluster) => {
    const provider = result(cluster, 'cloud_provider.id', 'N/A');
    const name = getClusterName(cluster);

    const clusterName = (
      <Tooltip content={`cluster name: ${cluster.name}`} position={TooltipPosition.right}>
        <Link to={`/details/${cluster.id}`}>{name.trim() !== '' ? name : cluster.name}</Link>
      </Tooltip>
    );

    const clusterState = getClusterStateAndDescription(cluster);

    const clusterStatus = (
      <Tooltip style={clusterState.style} content={clusterState.description}>
        <span>
          <ClusterStateIcon clusterState={typeof clusterState.state !== 'undefined' ? clusterState.state : ''} />
        </span>
      </Tooltip>
    );

    const clusterType = (
      <Tooltip
        content={cluster.managed
          ? 'OpenShift Dedicated (OSD) cluster managed by Red Hat' : 'Self-managed OpenShift Container Platform (OCP) cluster'
                }
      >
        <span>
          {cluster.managed ? 'OSD' : 'OCP'}
        </span>
      </Tooltip>
    );

    const clusterVersion = (
      <span>
        {cluster.openshift_version || 'N/A'}
        <ClusterUpdateLink cluster={cluster} />
      </span>
    );

    const dropDownKebab = (
      <ClusterActionsDropdown
        cluster={cluster}
        showConsoleButton
        showIDPButton={false}
        isKebab
      />
    );


    return (
      {
        cells: [
          { title: clusterName },
          { title: clusterStatus },
          { title: clusterType },
          { title: <SubscriptionStatusIndicator cluster={cluster} /> },
          { title: clusterVersion },
          {
            title: <ClusterLocationLabel
              regionID={result(cluster, 'region.id', 'N/A')}
              cloudProviderID={provider}
            />,
          },
          { title: dropDownKebab },
        ],
      }
    );
  };

  const hiddenOnMdOrSmaller = classNames(Visibility.visibleOnLg, Visibility.hiddenOnMd,
    Visibility.hiddenOnSm);

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Status' },
    { title: 'Type', transforms: [cellWidth(10)] },
    { title: 'Subscription Status', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Version', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Provider (Location)', columnTransforms: [hiddenOnMdOrSmaller] },
    '',
  ];


  return (
    <Table
      cells={columns}
      rows={clusters.map(cluster => clusterRow(cluster))}
      onSort={onSortToggle}
      sortBy={sortBy}
      aria-label="Clusters"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ClusterListTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
};

export default ClusterListTable;
