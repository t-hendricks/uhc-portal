import result from 'lodash/result';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Tooltip, OverlayTrigger, DropdownKebab, MenuItem, Grid,
} from 'patternfly-react';
import { Link } from 'react-router-dom';
import { TableGrid } from 'patternfly-react-extensions';
import { viewConstants } from '../../../redux/constants';
import ViewPaginationRow from '../viewPaginationRow';
import ClusterStateIcon from '../ClusterStateIcon';
import NumberWithUnit from '../NumberWithUnit';
import ClusterLocationLabel from './ClusterLocationLabel';

function ClusterListTable(props) {
  const {
    viewOptions, setSorting, openEditClusterDialog, openDeleteClusterDialog,
    openEditDisplayNameDialog,
  } = props;
  let { clusters } = props;
  if (!clusters) {
    clusters = [];
  }

  const nameColSizes = { md: 4 };
  const statusColSizes = { md: 1 };
  const statColSizes = { md: 1 };
  const locationColSizes = { md: 2 };

  const isSorted = columnID => viewOptions.sorting.sortField === columnID;

  const onSortToggle = (id) => {
    const sorting = Object.assign({}, viewOptions.sorting);
    if (viewOptions.sorting.sortField === id) {
      sorting.isAscending = !sorting.isAscending;
    }
    sorting.sortField = id;
    setSorting(sorting);
  };

  const clusterRow = (cluster, index) => {
    const provider = cluster.cloud_provider.id || 'N/A';
    const name = cluster.display_name || ''; // This would've been one trenary condition if the backend didn't have omitEmpty on display_name
    // The trenary for consoleURL is needed because the API does not guarantee fields being present.
    // We'll have a lot of these all over the place as we grow :(
    const consoleURL = cluster.console ? cluster.console.url : false;
    const consoleMenuItem = consoleURL ? (
      <MenuItem href={consoleURL}>
          Launch Admin Console
      </MenuItem>)
      : (
        <MenuItem disabled title="Admin console is not yet available for this cluster">
          Launch Admin Console
        </MenuItem>
      );

    const editClusterItem = cluster.dedicated ? (
      <MenuItem onClick={() => openEditClusterDialog(cluster)}>
        Edit Cluster
      </MenuItem>) : (
        <MenuItem disabled title="Self managed cluster cannot be edited">
          Edit Cluster
        </MenuItem>);

    const editDisplayNameItem = (
      <MenuItem onClick={() => openEditDisplayNameDialog(cluster)}>
        Edit Display Name
      </MenuItem>);

    const deleteClusterItem = cluster.dedicated ? (
      <MenuItem onClick={
    () => openDeleteClusterDialog(cluster.id, cluster.name)
    }
      >
    Delete Cluster
      </MenuItem>)
      : (
        <MenuItem disabled title="Self managed cluster cannot be deleted">
      Delete Cluster
        </MenuItem>
      );

    const clusterName = (
      <OverlayTrigger
        overlay={<Tooltip id={cluster.id}>{`cluster name: ${cluster.name}`}</Tooltip>}
        placement="right"
      >
        <span>{name.trim() !== '' ? name : cluster.name}</span>
      </OverlayTrigger>
    );

    const clusterStatus = (
      <OverlayTrigger
        overlay={<Tooltip style={{ textTransform: 'capitalize' }} id={`${cluster.id}-status-tooltip`}>{cluster.state}</Tooltip>}
        placement="top"
        trigger={['hover', 'focus']}
        rootClose={false}
      >
        {/* The span here is needed to work around a bug that caused the tooltip
        to not render after we moved the icon to its own component */}
        <span>
          <ClusterStateIcon clusterState={typeof cluster.state !== 'undefined' ? cluster.state : ''} />
        </span>
      </OverlayTrigger>
    );

    const clusterType = (
      <OverlayTrigger
        overlay={(
          <Tooltip id={`${cluster.id}-type-tooltip`}>
            {cluster.dedicated
              ? 'OpenShift Dedicated (OSD) cluster managed by Red Hat'
              : 'Self-managed OpenShift Container Platform (OCP) cluster'
            }
          </Tooltip>)}
        placement="top"
        trigger={['hover', 'focus']}
        rootClose={false}
      >
        <span>{cluster.dedicated ? 'Dedicated' : 'Self-managed'}</span>
      </OverlayTrigger>
    );

    return (
      <TableGrid.Row key={index}>
        <Grid.Col {...nameColSizes}>
          <Link to={`/cluster/${cluster.id}`}>
            {clusterName}
          </Link>
        </Grid.Col>
        <Grid.Col {...statusColSizes}>
          {clusterStatus}
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          {clusterType}
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.cpu.total} unit="vCPU" />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.storage.total} isBytes />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <NumberWithUnit valueWithUnit={cluster.memory.total} isBytes />
        </Grid.Col>
        <Grid.Col {...locationColSizes}>
          <ClusterLocationLabel
            regionID={result(cluster, 'region.id', 'N/A')}
            cloudProviderID={provider}
          />
        </Grid.Col>
        <Grid.Col {...statColSizes}>
          <DropdownKebab id={`${cluster.id}-dropdown`} pullRight>
            {consoleMenuItem}
            {editDisplayNameItem}
            {editClusterItem}
            {deleteClusterItem}
          </DropdownKebab>
        </Grid.Col>
      </TableGrid.Row>
    );
  };

  return (
    <React.Fragment>
      <TableGrid id="table-grid">
        <TableGrid.Head>
          <TableGrid.ColumnHeader
            id="name"
            sortable
            isSorted={isSorted('name')}
            isAscending={viewOptions.sorting.isAscending}
            onSortToggle={() => onSortToggle('name')}
            {...nameColSizes}
          >
            Name
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="status"
            isSorted={false}
            isAscending
            {...statusColSizes}
          >
            Status
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="type"
            isSorted={false}
            isAscending
            {...statColSizes}
          >
            Type
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="cpu"
            isSorted={false}
            isAscending
            {...statColSizes}
          >
            CPU
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="memory"
            isSorted={false}
            isAscending
            {...statColSizes}
          >
            Memory
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="storage"
            isSorted={false}
            isAscending
            {...statColSizes}
          >
            Storage
          </TableGrid.ColumnHeader>
          <TableGrid.ColumnHeader
            id="location"
            isSorted={false}
            isAscending
            {...locationColSizes}
          >
            Provider (Location)
          </TableGrid.ColumnHeader>
        </TableGrid.Head>
        <TableGrid.Body>
          {clusters.map((cluster, index) => clusterRow(cluster, index))}
        </TableGrid.Body>
      </TableGrid>
      <ViewPaginationRow
        viewType={viewConstants.CLUSTERS_VIEW}
        currentPage={viewOptions.currentPage}
        pageSize={viewOptions.pageSize}
        totalCount={viewOptions.totalCount}
        totalPages={viewOptions.totalPages}
      />
    </React.Fragment>);
}

ClusterListTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  openEditClusterDialog: PropTypes.func.isRequired,
  openDeleteClusterDialog: PropTypes.func.isRequired,
  openEditDisplayNameDialog: PropTypes.func.isRequired,
};

export default ClusterListTable;
