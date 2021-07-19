import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@patternfly/react-core';
import {
  cellWidth,
  classNames,
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
  Visibility,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import ClusterLocationLabel from '../../../common/ClusterLocationLabel';
import getClusterName from '../../../../../common/getClusterName';
import modals from '../../../../common/Modal/modals';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { getClusterStateAndDescription } from '../../../common/clusterStates';

function ArchivedClusterListTable(props) {
  const { viewOptions, setSorting } = props;
  const { clusters, openModal } = props;
  if (!clusters || clusters.length === 0) {
    return <p className="notfound">No results match the filter criteria.</p>;
  }

  const hiddenOnMdOrSmaller = classNames(Visibility.visibleOnLg, Visibility.hiddenOnMd,
    Visibility.hiddenOnSm);

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Type', transforms: [sortable] },
    { title: 'Status', transforms: [sortable] },
    { title: 'Provider (Location)', columnTransforms: [hiddenOnMdOrSmaller] },
    '',
  ];

  const sortColumns = {
    Name: 'display_name',
    Type: 'plan.type',
    Status: 'status',
  };

  const sortBy = {
    index: viewOptions.sorting.sortIndex,
    direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
  };

  const onSortToggle = (_event, index, direction) => {
    const sorting = { ...viewOptions.sorting };
    sorting.isAscending = direction === SortByDirection.asc;
    sorting.sortField = sortColumns[columns[index].title];
    sorting.sortIndex = index;
    setSorting(sorting);
  };

  const clusterRow = (cluster) => {
    const provider = get(cluster, 'cloud_provider.id', 'N/A');
    const name = getClusterName(cluster);

    const clusterName = (
      <Link to={`/details/s/${cluster.subscription.id}`}>{name}</Link>
    );

    const clusterStatus = getClusterStateAndDescription(cluster).description;

    const openUnarchiveModal = () => openModal(modals.UNARCHIVE_CLUSTER,
      {
        subscriptionID: cluster.subscription ? cluster.subscription.id : '',
        name,
      });

    const unarchiveButton = cluster.subscription.status !== subscriptionStatuses.DEPROVISIONED && (
      <Button variant="secondary" onClick={openUnarchiveModal} isDisabled={!cluster.canEdit}>
        Unarchive
      </Button>
    );

    return [
      { title: clusterName },
      { title: <ClusterTypeLabel cluster={cluster} /> },
      {
        title: <span className="cluster-status-string">{clusterStatus}</span>,
      },
      {
        title: <ClusterLocationLabel
          regionID={get(cluster, 'region.id', 'N/A')}
          cloudProviderID={provider}
        />,
      },
      {
        title: unarchiveButton,
      },
    ];
  };

  return (
    <Table
      cells={columns}
      rows={clusters.map(cluster => clusterRow(cluster))}
      onSort={onSortToggle}
      sortBy={sortBy}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ArchivedClusterListTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default ArchivedClusterListTable;
