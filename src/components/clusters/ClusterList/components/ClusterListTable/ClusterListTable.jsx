import result from 'lodash/result';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Popover,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { InfoCircleIcon, OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';
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
import NumberWithUnit from './NumberWithUnit';
import ClusterLocationLabel from './ClusterLocationLabel';
import ClusterActionsDropdown from '../../../common/ClusterActionsDropdown';
import { getClusterStateAndDescription } from '../../../common/clusterStates';


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
    const name = cluster.display_name || ''; // This would've been one trenary condition if the backend didn't have omitEmpty on display_name

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
          {cluster.managed ? 'Managed' : 'Self-managed'}
        </span>
      </Tooltip>
    );

    const clusterUpdate = cluster.console && cluster.console.url ? (
      <a href={`${cluster.console.url}/settings/cluster`} target="_blank" rel="noreferrer">
        <Button variant="link" icon={<OutlinedArrowAltCircleUpIcon />}>
          Update
        </Button>
      </a>
    ) : (
      <Popover
        position="top"
        aria-label="Update"
        bodyContent={(
          <div>
            An update is available for this cluster.
            Navigate to the Cluster settings page in the cluster&apos;s web console to update.
            {' '}
            <a href="https://docs.openshift.com/container-platform/latest/updating/updating-cluster.html" target="_blank">
              Learn more
            </a>
          </div>
        )}
      >
        <Button variant="link" icon={<InfoCircleIcon />}>
          Update
        </Button>
      </Popover>
    );
    const clusterVersion = (
      <span>
        {cluster.openshift_version || 'Unknown'}
        {' '}
        { !cluster.managed && cluster.metrics.version_update_available && (clusterUpdate) }
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


    return [
      { title: clusterName },
      { title: clusterStatus },
      { title: clusterType },
      { title: <NumberWithUnit valueWithUnit={cluster.metrics.cpu.total} unit="vCPU" /> },
      { title: <NumberWithUnit valueWithUnit={cluster.metrics.memory.total} isBytes /> },
      { title: clusterVersion },
      {
        title: <ClusterLocationLabel
          regionID={result(cluster, 'region.id', 'N/A')}
          cloudProviderID={provider}
        />,
      },
      { title: dropDownKebab },
    ];
  };

  const hiddenOnMdOrSmaller = classNames(Visibility.visibleOnLg, Visibility.hiddenOnMd,
    Visibility.hiddenOnSm);

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Status' },
    { title: 'Type' },
    { title: 'vCPU', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Memory', columnTransforms: [hiddenOnMdOrSmaller] },
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
