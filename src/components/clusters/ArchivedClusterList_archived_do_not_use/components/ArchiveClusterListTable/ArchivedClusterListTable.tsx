import React from 'react';

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { SortByDirection, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ThSortType } from '@patternfly/react-table/dist/esm/components/Table/base/types';
import { IVisibility } from '@patternfly/react-table/dist/esm/components/Table/utils/decorators/classNames';

import { Link } from '~/common/routing';
import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterWithPermissions, ViewOptions, ViewSorting } from '~/types/types';

import getClusterName from '../../../../../common/getClusterName';
import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import modals from '../../../../common/Modal/modals';
import ClusterLocationLabel from '../../../common/archived_do_not_use/ClusterLocationLabel';
import { getClusterStateAndDescription } from '../../../common/clusterStates';
import ClusterTypeLabel from '../../../common/ClusterTypeLabel';

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
  const columnNames = {
    name: 'Name',
    type: 'Type',
    status: 'Status',
    provider: 'Provider (Location)',
  };

  const sortColumns = {
    name: 'display_name',
    status: 'status',
  };

  const providerVisibility: (keyof IVisibility)[] = ['visibleOnLg', 'hiddenOnMd', 'hiddenOnSm'];

  const clusterRow = (cluster: ClusterWithPermissions) => {
    const provider = cluster.cloud_provider?.id ?? 'N/A';
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
      cluster.subscription?.status !== SubscriptionCommonFieldsStatus.Deprovisioned
        ? unarchiveBtn
        : null;

    return (
      <Tr key={cluster.id}>
        <Td dataLabel={columnNames.name}>{clusterName}</Td>
        <Td dataLabel={columnNames.type}>
          <ClusterTypeLabel cluster={cluster} />
        </Td>
        <Td dataLabel={columnNames.status}>
          <span className="cluster-status-string">{clusterStatus}</span>
        </Td>
        <Td dataLabel={columnNames.provider} visibility={providerVisibility}>
          <ClusterLocationLabel regionID={cluster.region?.id ?? 'N/A'} cloudProviderID={provider} />
        </Td>
        <Td isActionCell>{unarchiveBtnCondition}</Td>
      </Tr>
    );
  };

  const getSortParams = (columnIndex: number, sortColumnField: string): ThSortType => ({
    sortBy: {
      index: viewOptions.sorting.sortIndex,
      direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
    },
    onSort: (_event, index, direction) => {
      const sorting = { ...viewOptions.sorting };
      sorting.isAscending = direction === SortByDirection.asc;
      sorting.sortField = sortColumnField;
      sorting.sortIndex = index;
      setSorting(sorting);
    },
    columnIndex,
  });

  return (
    <Table aria-label="Archived clusters">
      <Thead>
        <Tr>
          <Th width={30} sort={getSortParams(0, sortColumns.name)}>
            {columnNames.name}
          </Th>
          <Th>{columnNames.type}</Th>
          <Th sort={getSortParams(2, sortColumns.status)}>{columnNames.status}</Th>
          <Th visibility={providerVisibility}>{columnNames.provider}</Th>
          <Th screenReaderText="Cluster action" />
        </Tr>
      </Thead>
      <Tbody>
        {!clusters || clusters.length === 0 ? (
          <Tr>
            <Td colSpan={5}>
              <Bullseye>
                <EmptyState>
                  <EmptyStateHeader
                    titleText="No archived clusters found."
                    icon={<EmptyStateIcon icon={SearchIcon} />}
                    headingLevel="h4"
                  />
                  <EmptyStateBody>
                    This filter criteria matches no clusters. Try changing your filter settings.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            </Td>
          </Tr>
        ) : (
          clusters.map((cluster) => clusterRow(cluster))
        )}
      </Tbody>
    </Table>
  );
};

export default ArchivedClusterListTable;
