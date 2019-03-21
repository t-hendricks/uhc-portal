import result from 'lodash/result';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Tooltip, OverlayTrigger, DropdownKebab, Grid,
} from 'patternfly-react';
import { Link } from 'react-router-dom';
import { TableGrid } from 'patternfly-react-extensions';
import ClusterBadge from '../../../common/ClusterBadge/ClusterBadge';
import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import NumberWithUnit from './NumberWithUnit';
import ClusterLocationLabel from './ClusterLocationLabel';
import ClusterActionsDropdown from '../../../common/ClusterActionsDropdown';

function ClusterListTable(props) {
  const { viewOptions, setSorting } = props;
  const { clusters } = props;
  if (!clusters || clusters.length === 0) {
    return <p className="notfound">No Results Match the Filter Criteria.</p>;
  }

  const nameColSizes = {
    xs: 9, sm: 8, md: 5, lg: 3,
  };
  const statusColSizes = { xs: 1 };
  const statColSizes = {
    md: 1, mdHidden: true, smHidden: true, xsHidden: true,
  };
  const locationColSizes = {
    md: 3, lg: 2, smHidden: true, xsHidden: true,
  };
  const typesSizes = { sm: 2, xsHidden: true };
  const kebabColSizes = { xs: 1 };

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
    const provider = result(cluster, 'cloud_provider.id', 'N/A');
    const name = cluster.display_name || ''; // This would've been one trenary condition if the backend didn't have omitEmpty on display_name

    const clusterName = (
      <OverlayTrigger
        overlay={<Tooltip id={cluster.id}>{`cluster name: ${cluster.name}`}</Tooltip>}
        placement="right"
      >
        <Link to={`/details/${cluster.id}`}>{name.trim() !== '' ? name : cluster.name}</Link>
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
            {cluster.managed
              ? 'OpenShift Dedicated (OSD) cluster managed by Red Hat'
              : 'Self-managed OpenShift Container Platform (OCP) cluster'
            }
          </Tooltip>)}
        placement="top"
        trigger={['hover', 'focus']}
        rootClose={false}
      >
        <span>{cluster.managed ? 'Managed' : 'Self-managed'}</span>
      </OverlayTrigger>
    );

    return (
      <TableGrid.Row key={index} className="cluster-list-row">
        <Grid.Col {...nameColSizes}>
          <ClusterBadge clusterName={clusterName} />
        </Grid.Col>
        <Grid.Col {...statusColSizes}>
          {clusterStatus}
        </Grid.Col>
        <Grid.Col {...typesSizes}>
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
        <Grid.Col {...kebabColSizes}>
          <DropdownKebab id={`${cluster.id}-dropdown`} pullRight>
            <ClusterActionsDropdown
              cluster={cluster}
              showConsoleButton
            />
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
            {...typesSizes}
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
    </React.Fragment>);
}

ClusterListTable.propTypes = {
  clusters: PropTypes.array.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  openDeleteClusterDialog: PropTypes.func.isRequired,
};

export default ClusterListTable;
