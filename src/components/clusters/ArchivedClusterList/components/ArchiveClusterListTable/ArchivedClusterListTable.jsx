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
import ClusterLocationLabel from '../../../common/ClusterLocationLabel/ClusterLocationLabel';
import getClusterName from '../../../../../common/getClusterName';
import modals from '../../../../common/Modal/modals';


function ArchivedClusterListTable(props) {
  const { viewOptions, setSorting } = props;
  const { clusters, openModal } = props;
  if (!clusters || clusters.length === 0) {
    return <p className="notfound">No results match the filter criteria.</p>;
  }

  const sortBy = {
    index: 0, // TODO support more fields
    direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
  };

  const onSortToggle = (_event, _index, direction) => {
    const sorting = { ...viewOptions.sorting };
    sorting.isAscending = direction === SortByDirection.asc;
    sorting.sortField = 'name'; // TODO support more fields
    setSorting(sorting);
  };

  const clusterRow = (cluster) => {
    const provider = get(cluster, 'cloud_provider.id', 'N/A');
    const name = getClusterName(cluster);

    const clusterName = (
      <Link to={`/details/${cluster.id}`}>{name}</Link>
    );

    const openUnarchiveModal = () => openModal(modals.UNARCHIVE_CLUSTER,
      {
        subscriptionID: cluster.subscription ? cluster.subscription.id : '',
        name,
      });

    const unarchiveButton = (
      <Button variant="secondary" onClick={openUnarchiveModal} isDisabled={!cluster.canEdit}>
        Unarchive
      </Button>
    );

    return [
      { title: clusterName },
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

  const hiddenOnMdOrSmaller = classNames(Visibility.visibleOnLg, Visibility.hiddenOnMd,
    Visibility.hiddenOnSm);

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(70)] },
    { title: 'Provider (Location)', columnTransforms: [hiddenOnMdOrSmaller] },
    '',
  ];


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
