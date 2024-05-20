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
import {
  ActionsColumn,
  SortByDirection,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

import getClusterName from '../../../../common/getClusterName';
import { isAISubscriptionWithoutMetrics } from '../../../../common/isAssistedInstallerCluster';
import { actionResolver } from '../../common/ClusterActionsDropdown/ClusterActionsDropdownItems';
import ClusterLocationLabel from '../../common/ClusterLocationLabel';
import ClusterStateIcon from '../../common/ClusterStateIcon';
import clusterStates, {
  getClusterStateAndDescription,
  isOSDGCPWaitingForRolesOnHostProject,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isWaitingROSAManualMode,
} from '../../common/clusterStates';
import ClusterTypeLabel from '../../common/ClusterTypeLabel';
import ClusterUpdateLink from '../../common/ClusterUpdateLink';
import getClusterVersion from '../../common/getClusterVersion';
import ActionRequiredLink from '../../common/InstallProgress/ActionRequiredLink';
import ProgressList from '../../common/InstallProgress/ProgressList';

import ClusterCreatedIndicator from './ClusterCreatedIndicator';

const { ClusterStatus: AIClusterStatus } = OCM;

const skeletonRows = () =>
  new Array(10).fill(
    <Tr>
      <Td colSpan={7}>
        <Skeleton />
      </Td>
    </Tr>,
  );

function ClusterListTable(props) {
  const {
    viewOptions,
    setSorting,
    clusters,
    openModal,
    isPending,
    setClusterDetails,
    canSubscribeOCPList = {},
    canTransferClusterOwnershipList = {},
    toggleSubscriptionReleased,
    canHibernateClusterList = {},
    refreshFunc,
  } = props;
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

  const sortColumns = {
    Name: 'display_name',
    Created: 'created_at',
  };

  const getSortParams = (columnIndex, sortColumnIndex) => ({
    sortBy: {
      index: viewOptions.sorting.sortIndex,
      direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
    },
    onSort: (_event, index, direction) => {
      const sorting = { ...viewOptions.sorting };
      sorting.isAscending = direction === SortByDirection.asc;
      sorting.sortField = sortColumnIndex;
      sorting.sortIndex = index;
      setSorting(sorting);
    },
    columnIndex,
  });

  const hiddenOnMdOrSmaller = ['visibleOnLg', 'hiddenOnMd', 'hiddenOnSm'];

  const columns = {
    name: { title: 'Name', width: 30, sortIndex: sortColumns.Name },
    status: { title: 'Status', width: 15 },
    type: { title: 'Type', width: 10 },
    created: { title: 'Created', visibility: hiddenOnMdOrSmaller, sortIndex: sortColumns.Created },
    version: { title: 'Version', visibility: hiddenOnMdOrSmaller },
    provider: { title: 'Provider (Region)', visibility: hiddenOnMdOrSmaller },
    actions: { title: '', screenReaderText: 'cluster actions' },
  };

  const columnCells = Object.keys(columns).map((column, index) => (
    <Th
      width={columns[column].width}
      visibility={columns[column].visibility}
      sort={columns[column].sortIndex ? getSortParams(index, columns[column].sortIndex) : undefined}
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
    <Link
      to={`/details/s/${cluster.subscription.id}`}
      onClick={() => {
        if (!cluster.partialCS) {
          setClusterDetails(cluster);
        }
      }}
    >
      {children}
    </Link>
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
        <Td isActionCell>
          {!isPending && cluster ? (
            <ActionsColumn
              items={actionResolver(
                cluster,
                true,
                openModal,
                canSubscribeOCPList[cluster.id] || false,
                canTransferClusterOwnershipList[cluster.id] || false,
                canHibernateClusterList[cluster.id] || false,
                toggleSubscriptionReleased,
                refreshFunc,
                true,
              )}
            />
          ) : null}
        </Td>
      </Tr>
    );
  };

  return (
    <Table aria-label="Cluster List">
      <Thead>
        <Tr>{columnCells}</Tr>
      </Thead>
      <Tbody>{isPending ? skeletonRows() : clusters.map((cluster) => clusterRow(cluster))}</Tbody>
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
  canSubscribeOCPList: PropTypes.objectOf(PropTypes.bool),
  canTransferClusterOwnershipList: PropTypes.objectOf(PropTypes.bool),
  canHibernateClusterList: PropTypes.objectOf(PropTypes.bool),
  toggleSubscriptionReleased: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
};

export default ClusterListTable;
