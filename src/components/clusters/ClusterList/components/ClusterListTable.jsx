import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Tooltip,
  TooltipPosition,
  Popover,
  PopoverPosition,
  Button,
} from '@patternfly/react-core';
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
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';

import { Link } from 'react-router-dom';
import ClusterStateIcon from '../../common/ClusterStateIcon/ClusterStateIcon';
import ClusterLocationLabel from '../../common/ClusterLocationLabel/ClusterLocationLabel';
import clusterStates, { getClusterStateAndDescription } from '../../common/clusterStates';
import ClusterUpdateLink from '../../common/ClusterUpdateLink';
import SubscriptionStatusIndicator from './SubscriptionStatusIndicator';
import getClusterName from '../../../../common/getClusterName';
import { actionResolver } from '../../common/ClusterActionsDropdown/ClusterActionsDropdownItems';

function ClusterListTable(props) {
  const {
    viewOptions, setSorting, clusters, openModal, isPending, setClusterDetails,
  } = props;
  if (!isPending && (!clusters || clusters.length === 0)) {
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

  const clusterRow = (cluster) => {
    const provider = get(cluster, 'cloud_provider.id', 'N/A');
    const name = getClusterName(cluster);

    const clusterName = (
      <Tooltip content={`cluster name: ${cluster.name}`} position={TooltipPosition.right}>
        <Link to={`/details/${cluster.id}`} onClick={() => setClusterDetails(cluster)}>{name.trim() !== '' ? name : cluster.name}</Link>
      </Tooltip>
    );

    const clusterState = getClusterStateAndDescription(cluster);
    const icon = <ClusterStateIcon clusterState={clusterState.state || ''} />;
    const clusterStatus = (state) => {
      if (state === clusterStates.ERROR) {
        return (
          <span>
            <Popover
              position={PopoverPosition.top}
              bodyContent={(
                <>
                  Your cluster is in error state.
                  {' '}
                  <a
                    href="https://access.redhat.com/support/cases/#/case/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Red Hat Support
                  </a>
                  {' '}
                  for further assistance.
                </>
                )}
              aria-label="Status: Error"
            >
              <Button
                className="cluster-status-string"
                variant="link"
                isInline
                icon={icon}
              >
                {state}
              </Button>
            </Popover>
          </span>
        );
      }
      return (
        <span className="cluster-status-string">
          {icon}
          {state}
        </span>
      );
    };

    const clusterType = (
      <Tooltip
        content={cluster.managed
          ? 'OpenShift Dedicated (OSD) cluster managed by Red Hat' : 'Self-managed OpenShift Container Platform (OCP) cluster'}
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

    return {
      cells: [
        { title: clusterName },
        { title: clusterStatus(clusterState.state) },
        { title: clusterType },
        { title: <SubscriptionStatusIndicator cluster={cluster} /> },
        { title: clusterVersion },
        {
          title: <ClusterLocationLabel
            regionID={get(cluster, 'region.id', 'N/A')}
            cloudProviderID={provider}
          />,
        },
      ],
      cluster,
    };
  };

  const hiddenOnMdOrSmaller = classNames(Visibility.visibleOnLg, Visibility.hiddenOnMd,
    Visibility.hiddenOnSm);

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Status', transforms: [cellWidth(15)] },
    { title: 'Type', transforms: [cellWidth(10)] },
    { title: 'Subscription Status', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Version', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Provider (Location)', columnTransforms: [hiddenOnMdOrSmaller] },
    '',
  ];

  const rows = isPending ? skeletonRows() : clusters.map(cluster => clusterRow(cluster));
  const resolver = isPending ? undefined
    : rowData => actionResolver(rowData.cluster, true, openModal);

  return (
    <Table
      aria-label="Cluster List"
      cells={columns}
      rows={rows}
      actionResolver={resolver}
      onSort={onSortToggle}
      sortBy={sortBy}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}

ClusterListTable.propTypes = {
  openModal: PropTypes.func.isRequired,
  clusters: PropTypes.array.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
  setClusterDetails: PropTypes.func.isRequired,
};

export default ClusterListTable;
