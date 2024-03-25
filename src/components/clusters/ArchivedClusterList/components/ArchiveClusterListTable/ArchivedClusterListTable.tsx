import get from 'lodash/get';
import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
} from '@patternfly/react-core';
import {
  cellWidth,
  classNames,
  sortable,
  SortByDirection,
  Visibility,
} from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableHeader as TableHeaderDeprecated,
  TableBody as TableBodyDeprecated,
} from '@patternfly/react-table/deprecated';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { Link } from 'react-router-dom-v5-compat';
import { ClusterWithPermissions, ViewOptions, ViewSorting } from '~/types/types';
import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import ClusterLocationLabel from '../../../common/ClusterLocationLabel';
import getClusterName from '../../../../../common/getClusterName';
import modals from '../../../../common/Modal/modals';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import { getClusterStateAndDescription } from '../../../common/clusterStates';

type ArchivedClusterListTableProps = {
  clusters: ClusterWithPermissions[];
  openModal: (modalName: string, data?: unknown) => void;
  setSorting: (sorting: ViewSorting) => void;
  viewOptions: ViewOptions;
};

const ArchivedClusterListTable = ({
  viewOptions,
  setSorting,
  clusters,
  openModal,
}: ArchivedClusterListTableProps) => {
  if (!clusters || clusters.length === 0) {
    return (
      <EmptyState>
        <EmptyStateHeader
          titleText="No archived clusters found."
          icon={<EmptyStateIcon icon={SearchIcon} />}
          headingLevel="h4"
        />
        <EmptyStateBody>
          This filter criteria matches no clusters.
          <br />
          Try changing your filter settings.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  const hiddenOnMdOrSmaller = classNames(
    Visibility.visibleOnLg || '',
    Visibility.hiddenOnMd || '',
    Visibility.hiddenOnSm || '',
  );

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Type' },
    { title: 'Status', transforms: [sortable] },
    { title: 'Provider (Location)', columnTransforms: [hiddenOnMdOrSmaller] },
    '', // TODO: to avoid TypeError: headerData[(cellIndex + additionalColsIndexShift)] is undefined from openshift-assisted_ui-lib
  ];

  const sortBy = {
    index: viewOptions.sorting.sortIndex,
    direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
  };

  const onSortToggle = (_event: object, index: number, direction: string) => {
    type Column = {
      title: string;
    };

    const sortColumns = {
      Name: 'display_name',
      Status: 'status',
    };

    const sorting = { ...viewOptions.sorting };
    sorting.isAscending = direction === SortByDirection.asc;
    const column = columns[index] as Column;
    sorting.sortField = sortColumns[column.title as keyof typeof sortColumns];
    sorting.sortIndex = index;
    setSorting(sorting);
  };

  const clusterRow = (cluster: ClusterWithPermissions) => {
    const provider = get(cluster, 'cloud_provider.id', 'N/A');
    const name = getClusterName(cluster);

    const clusterName = <Link to={`/details/s/${cluster.subscription?.id}`}>{name}</Link>;

    const clusterStatus = getClusterStateAndDescription(cluster).description;

    const openUnarchiveModal = () =>
      openModal(modals.UNARCHIVE_CLUSTER, {
        subscriptionID: cluster.subscription ? cluster.subscription.id : '',
        name,
        shouldDisplayClusterName: true,
      });

    const canNotEditReason =
      !cluster.canEdit && 'You do not have permissions to unarchive this cluster';

    const unarchiveBtn = (
      <ButtonWithTooltip
        variant="secondary"
        onClick={openUnarchiveModal}
        disableReason={canNotEditReason}
      >
        Unarchive
      </ButtonWithTooltip>
    );
    const unarchiveBtnCondition =
      cluster.subscription?.status !== subscriptionStatuses.DEPROVISIONED && unarchiveBtn;

    return [
      { title: clusterName },
      { title: <ClusterTypeLabel cluster={cluster} /> },
      {
        title: <span className="cluster-status-string">{clusterStatus}</span>,
      },
      {
        title: (
          <ClusterLocationLabel
            regionID={get(cluster, 'region.id', 'N/A')}
            cloudProviderID={provider}
          />
        ),
      },
      {
        title: unarchiveBtnCondition,
      },
    ];
  };

  const rows = clusters.map(clusterRow);

  return (
    <TableDeprecated
      cells={columns}
      rows={rows}
      onSort={onSortToggle}
      sortBy={sortBy}
      aria-label="Archived clusters"
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
  );
};

export default ArchivedClusterListTable;
