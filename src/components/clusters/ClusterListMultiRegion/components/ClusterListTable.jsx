import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import * as OCM from '@openshift-assisted/ui-lib/ocm';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Label,
  Popover,
  PopoverPosition,
  Skeleton,
} from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { SortByDirection, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

import { versionComparator } from '~/common/versionComparator';

import getClusterName from '../../../../common/getClusterName';
import { isAISubscriptionWithoutMetrics } from '../../../../common/isAssistedInstallerCluster';
import ClusterStateIcon from '../../common/ClusterStateIcon';
import clusterStates, {
  getClusterStateAndDescription,
  isOSDGCPWaitingForRolesOnHostProject,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isWaitingROSAManualMode,
} from '../../common/clusterStates';
import { clusterType } from '../../common/clusterType';
import ClusterTypeLabel from '../../common/ClusterTypeLabel';
import ClusterUpdateLink from '../../common/ClusterUpdateLink';
import getClusterVersion from '../../common/getClusterVersion';
import ActionRequiredLink from '../../common/InstallProgress/ActionRequiredLink';
import ProgressList from '../../common/InstallProgress/ProgressList';
import { ClusterLocationLabel } from '../../commonMultiRegion/ClusterLocationLabel';

import ClusterCreatedIndicator from './ClusterCreatedIndicator';

const { ClusterStatus: AIClusterStatus } = OCM;

const skeletonRows = () =>
  [...Array(10).keys()].map((index) => (
    <Tr key={index} data-testid="skeleton">
      <Td colSpan={7}>
        <Skeleton screenreaderText="loading cluster" />
      </Td>
    </Tr>
  ));

const sortColumns = {
  Name: 'display_name',
  Created: 'created_at',
  Status: 'status',
  Type: 'type',
  Provider: 'provider',
  Version: 'version',
};

const hiddenOnMdOrSmaller = ['visibleOnLg', 'hiddenOnMd', 'hiddenOnSm'];

// exported only for testing purposes
// The order here is the same as the column order
export const columns = {
  name: { title: 'Name', width: 30, sortIndex: sortColumns.Name },
  status: { title: 'Status', width: 15, sortIndex: sortColumns.Status },
  type: { title: 'Type', width: 10, sortIndex: sortColumns.Type },
  created: { title: 'Created', visibility: hiddenOnMdOrSmaller, sortIndex: sortColumns.Created },
  version: { title: 'Version', visibility: hiddenOnMdOrSmaller, sortIndex: sortColumns.Version },
  provider: {
    title: 'Provider (Region)',
    visibility: hiddenOnMdOrSmaller,
    sortIndex: sortColumns.Provider,
  },
  actions: { title: '', screenReaderText: 'cluster actions' },
};
function ClusterListTable(props) {
  const { clusters, openModal, isPending } = props;
  const [activeSortIndex, setActiveSortIndex] = React.useState(sortColumns.Created);
  const [activeSortDirection, setActiveSortDirection] = React.useState(SortByDirection.desc);

  const getSortParams = (columnIndex) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: SortByDirection.asc,
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const getSortableRowValues = (cluster) => {
    const sortableValues = {};
    sortableValues[sortColumns.Name] = getClusterName(cluster);
    sortableValues[sortColumns.Created] = cluster.creation_timestamp;
    sortableValues[sortColumns.Status] = isAISubscriptionWithoutMetrics(cluster.subscription)
      ? cluster.state
      : getClusterStateAndDescription(cluster).description;
    sortableValues[sortColumns.Type] = clusterType(cluster).name;
    sortableValues[sortColumns.Provider] =
      `${get(cluster, 'cloud_provider.id', 'N/A')} ${get(cluster, 'region.id', 'N/A')}`;
    sortableValues[sortColumns.Version] = getClusterVersion(cluster);
    return sortableValues;
  };

  let sortedClusters = clusters;
  if (activeSortIndex !== null) {
    sortedClusters = clusters.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];

      const nameSort = () => {
        const aNameValue = getSortableRowValues(a)[sortColumns.Name];
        const bNameValue = getSortableRowValues(b)[sortColumns.Name];
        return activeSortDirection === SortByDirection.asc
          ? aNameValue.localeCompare(bNameValue)
          : bNameValue.localeCompare(aNameValue);
      };

      let sortValue = 0;
      if (activeSortIndex === sortColumns.Version) {
        // Set N/A version to a value that can be sorted against
        const versionA = aValue === 'N/A' ? '0.0.0' : aValue;
        const versionB = bValue === 'N/A' ? '0.0.0' : bValue;
        sortValue =
          activeSortDirection === SortByDirection.asc
            ? versionComparator(versionA, versionB)
            : versionComparator(versionB, versionA);
      } else if (typeof aValue === 'number') {
        // Numeric sort
        sortValue = activeSortDirection === SortByDirection.asc ? aValue - bValue : bValue - aValue;
      } else {
        // String sort
        sortValue =
          activeSortDirection === SortByDirection.asc
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
      }
      if (sortValue === 0 && activeSortIndex !== sortColumns.Name) {
        // Both values are tied - so secondary sort by name
        return nameSort();
      }
      return sortValue;
    });
  }

  if (!isPending && (!clusters || clusters.length === 0)) {
    return (
      <EmptyState>
        <EmptyStateHeader
          titleText="No clusters found."
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

  const columnCells = Object.keys(columns).map((column, index) => (
    <Th
      width={columns[column].width}
      visibility={columns[column].visibility}
      sort={columns[column].sortIndex ? getSortParams(columns[column].sortIndex) : undefined}
      // eslint-disable-next-line react/no-array-index-key
      key={index}
    >
      {columns[column].screenReaderText ? (
        <span className="pf-v5-screen-reader">{columns[column].screenReaderText}</span>
      ) : null}
      {columns[column].title}
    </Th>
  ));

  const linkToClusterDetails = (cluster, children) => (
    <Link to={`/details/s/${cluster.subscription.id}`}>{children}</Link>
  );

  const clusterRow = (cluster) => {
    const provider = get(cluster, 'cloud_provider.id', 'N/A');

    const clusterName = linkToClusterDetails(cluster, getClusterName(cluster));

    const clusterStatus = () => {
      if (isAISubscriptionWithoutMetrics(cluster.subscription)) {
        return <AIClusterStatus status={cluster.state} className="clusterstate" />;
      }

      const hasLimitedSupport = cluster.status?.limited_support_reason_count > 0;

      const { state, description } = getClusterStateAndDescription(cluster);
      const icon = (
        <ClusterStateIcon
          clusterState={state || ''}
          animated={false}
          limitedSupport={hasLimitedSupport}
        />
      );
      if (state === clusterStates.ERROR) {
        return (
          <span>
            <Popover
              position={PopoverPosition.top}
              bodyContent={
                <>
                  Your cluster is in error state.{' '}
                  <a
                    href="https://access.redhat.com/support/cases/#/case/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Red Hat Support
                  </a>{' '}
                  for further assistance.
                </>
              }
              aria-label="Status: Error"
            >
              <Button className="cluster-status-string" variant="link" isInline icon={icon}>
                {description}
              </Button>
            </Popover>
          </span>
        );
      }

      if (
        isWaitingROSAManualMode(cluster) ||
        isWaitingForOIDCProviderOrOperatorRolesMode(cluster) ||
        isOSDGCPWaitingForRolesOnHostProject(cluster)
      ) {
        // Show a popover for manual creation of ROSA operator roles and OIDC provider.
        return (
          <ActionRequiredLink
            cluster={cluster}
            icon={<ExclamationTriangleIcon color={warningColor.value} />}
          />
        );
      }
      if (
        state === clusterStates.WAITING ||
        state === clusterStates.PENDING ||
        state === clusterStates.VALIDATING ||
        state === clusterStates.INSTALLING
      ) {
        return (
          <Popover
            headerContent={<div>Installation status</div>}
            position={PopoverPosition.top}
            bodyContent={<ProgressList cluster={cluster} />}
            aria-label="Status: installing"
            maxWidth="38rem"
          >
            <Button
              className="cluster-status-string status-installing"
              variant="link"
              isInline
              icon={icon}
            >
              {description}
            </Button>
          </Popover>
        );
      }
      return (
        <span className="cluster-status-string">
          {icon}
          {description}
          {hasLimitedSupport
            ? linkToClusterDetails(
                cluster,
                <Label color="red" className="pf-v5-u-ml-xs">
                  Limited support
                </Label>,
              )
            : null}
        </span>
      );
    };

    // Note: hideOSDUpdates is set because we can't know if an update was already scheduled
    const clusterVersion = (
      <span>
        {getClusterVersion(cluster)}
        <ClusterUpdateLink cluster={cluster} openModal={openModal} hideOSDUpdates />
      </span>
    );

    return (
      <Tr key={cluster.id}>
        <Td dataLabel={columns.name.title} visibility={columns.name.visibility}>
          {clusterName}
        </Td>
        <Td dataLabel={columns.status.title} visibility={columns.status.visibility}>
          {clusterStatus()}
        </Td>
        <Td dataLabel={columns.type.title} visibility={columns.type.visibility}>
          <ClusterTypeLabel cluster={cluster} />
        </Td>
        <Td dataLabel={columns.created.title} visibility={columns.created.visibility}>
          <ClusterCreatedIndicator cluster={cluster} />
        </Td>
        <Td dataLabel={columns.version.title} visibility={columns.version.visibility}>
          {clusterVersion}
        </Td>
        <Td dataLabel={columns.provider.title} visibility={columns.provider.visibility}>
          <ClusterLocationLabel
            regionID={get(cluster, 'region.id', 'N/A')}
            cloudProviderID={provider}
          />
        </Td>
        <Td isActionCell />
      </Tr>
    );
  };

  return (
    <Table aria-label="Cluster List">
      <Thead>
        <Tr>{columnCells}</Tr>
      </Thead>
      <Tbody data-testid="clusterListTableBody">
        {isPending ? skeletonRows() : sortedClusters.map((cluster) => clusterRow(cluster))}
      </Tbody>
    </Table>
  );
}

ClusterListTable.propTypes = {
  openModal: PropTypes.func.isRequired,
  clusters: PropTypes.array.isRequired,

  isPending: PropTypes.bool,
};

export default ClusterListTable;
