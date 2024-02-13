import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Popover,
  PopoverPosition,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Label,
  EmptyStateHeader,
} from '@patternfly/react-core';
import {
  sortable,
  classNames,
  Visibility,
  SortByDirection,
  cellWidth,
} from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableHeader as TableHeaderDeprecated,
  TableBody as TableBodyDeprecated,
} from '@patternfly/react-table/deprecated';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

import { Link } from 'react-router-dom';
import * as OCM from '@openshift-assisted/ui-lib/ocm';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import ClusterStateIcon from '../../common/ClusterStateIcon/ClusterStateIcon';
import ClusterLocationLabel from '../../common/ClusterLocationLabel';
import clusterStates, {
  getClusterStateAndDescription,
  isWaitingROSAManualMode,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isOSDGCPWaitingForRolesOnHostProject,
} from '../../common/clusterStates';
import ClusterUpdateLink from '../../common/ClusterUpdateLink';
import ClusterCreatedIndicator from './ClusterCreatedIndicator';
import getClusterName from '../../../../common/getClusterName';
import { actionResolver } from '../../common/ClusterActionsDropdown/ClusterActionsDropdownItems';
import skeletonRows from '../../../common/SkeletonRows';
import ClusterTypeLabel from '../../common/ClusterTypeLabel';
import ProgressList from '../../common/InstallProgress/ProgressList';
import ActionRequiredLink from '../../common/InstallProgress/ActionRequiredLink';
import { isAISubscriptionWithoutMetrics } from '../../../../common/isAssistedInstallerCluster';
import getClusterVersion from '../../common/getClusterVersion';

const { ClusterStatus: AIClusterStatus } = OCM;
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

  const sortBy = {
    index: viewOptions.sorting.sortIndex,
    direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
  };

  const sortColumns = {
    Name: 'display_name',
    Created: 'created_at',
  };

  const hiddenOnMdOrSmaller = classNames(
    Visibility.visibleOnLg,
    Visibility.hiddenOnMd,
    Visibility.hiddenOnSm,
  );

  const columns = [
    { title: 'Name', transforms: [sortable, cellWidth(30)] },
    { title: 'Status', transforms: [cellWidth(15)] },
    { title: 'Type', transforms: [cellWidth(10)] },
    { title: 'Created', transforms: [sortable], columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Version', columnTransforms: [hiddenOnMdOrSmaller] },
    { title: 'Provider (Region)', columnTransforms: [hiddenOnMdOrSmaller] },
    '', // TODO: to avoid TypeError: headerData[(cellIndex + additionalColsIndexShift)] is undefined from penshift-assisted_ui-lib
  ];

  const onSortToggle = (_event, index, direction) => {
    const sorting = { ...viewOptions.sorting };
    sorting.isAscending = direction === SortByDirection.asc;
    sorting.sortField = sortColumns[columns[index].title];
    sorting.sortIndex = index;
    setSorting(sorting);
  };

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

    return {
      cells: [
        { title: clusterName },
        { title: clusterStatus() },
        { title: <ClusterTypeLabel cluster={cluster} /> },
        { title: <ClusterCreatedIndicator cluster={cluster} /> },
        { title: clusterVersion },
        {
          title: (
            <ClusterLocationLabel
              regionID={get(cluster, 'region.id', 'N/A')}
              cloudProviderID={provider}
            />
          ),
        },
      ],
      cluster,
    };
  };

  const rows = isPending ? skeletonRows() : clusters.map((cluster) => clusterRow(cluster));
  const resolver = isPending
    ? undefined
    : (rowData) =>
        actionResolver(
          rowData.cluster,
          true,
          openModal,
          canSubscribeOCPList[get(rowData, 'cluster.id')] || false,
          canTransferClusterOwnershipList[get(rowData, 'cluster.id')] || false,
          canHibernateClusterList[get(rowData, 'cluster.id')] || false,
          toggleSubscriptionReleased,
          refreshFunc,
          true,
        );

  return (
    <TableDeprecated
      aria-label="Cluster List"
      cells={columns}
      rows={rows}
      actionResolver={resolver}
      onSort={onSortToggle}
      sortBy={sortBy}
      ouiaId="clusterList"
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
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
