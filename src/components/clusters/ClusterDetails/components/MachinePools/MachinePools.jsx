import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  EmptyState,
  Label,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, cellWidth, expandable } from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import { EditClusterAutoScalerForDay2 } from '~/components/clusters/common/EditClusterAutoScalingDialog';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import MachinePoolNodesSummary from './MachinePoolNodesSummary';
import {
  UpdateAllMachinePools,
  UpdatePoolButton,
  UpdateMachinePoolModal,
} from './UpdateMachinePools';

import MachinePoolExpandedRow from './components/MachinePoolExpandedRow';
import DeleteMachinePoolModal from './components/DeleteMachinePoolModal/DeleteMachinePoolModal';
import {
  actionResolver,
  hasDefaultOrExplicitAutoscalingMachinePool,
  hasSubnets,
} from './machinePoolsHelper';

import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import ErrorBox from '../../../../common/ErrorBox';
import modals from '../../../../common/Modal/modals';
import { noQuotaTooltip } from '../../../../../common/helpers';
import { versionFormatter } from '../../../../../common/versionHelpers';
import { isHibernating, isHypershiftCluster, isROSA } from '../../../common/clusterStates';
import EditMachinePoolModal from './components/EditMachinePoolModal/EditMachinePoolModal';

import './MachinePools.scss';

const getOpenShiftVersion = (machinePool, isDisabled) => {
  const extractedVersion = get(machinePool, 'version.id', '');
  if (!extractedVersion) {
    return 'N/A';
  }
  return (
    <>
      {versionFormatter(extractedVersion) || extractedVersion}{' '}
      {!isDisabled ? <UpdatePoolButton machinePool={machinePool} /> : null}
    </>
  );
};

const initialState = {
  deletedRowIndex: null,
  openedRows: [],
  hideDeleteMachinePoolError: false,
  editMachinePoolId: undefined,
  addMachinePool: false,
};

class MachinePools extends React.Component {
  state = initialState;

  componentDidMount() {
    const {
      machinePoolsList,
      getMachinePools,
      getOrganizationAndQuota,
      machineTypes,
      getMachineTypes,
    } = this.props;

    if (!machinePoolsList.pending) {
      getMachinePools();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    getOrganizationAndQuota();
  }

  componentDidUpdate(prevProps) {
    const {
      deleteMachinePoolResponse,
      getClusterAutoscaler,
      clusterAutoscalerResponse,
      getMachinePools,
      machinePoolsList,
      getOrganizationAndQuota,
      cluster,
    } = this.props;
    const { deletedRowIndex } = this.state;

    if (
      deleteMachinePoolResponse.fulfilled &&
      prevProps.deleteMachinePoolResponse.pending &&
      !machinePoolsList.pending
    ) {
      getOrganizationAndQuota();
      getMachinePools();
    }

    if (
      ((prevProps.machinePoolsList.pending && machinePoolsList.fulfilled) ||
        deleteMachinePoolResponse.error) &&
      deletedRowIndex !== null
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        produce((draft) => {
          draft.deletedRowIndex = null;
        }),
      );
    }

    // Initially, we check the "cluster.autoscaler" to see if there should be data.
    // We must combine this with the actions that the user can do to enable / delete the autoscaler in the modal
    if (
      !isHypershiftCluster(cluster) &&
      clusterAutoscalerResponse.hasAutoscaler &&
      !clusterAutoscalerResponse.getAutoscaler.data &&
      !clusterAutoscalerResponse.getAutoscaler.pending
    ) {
      getClusterAutoscaler();
    }
  }

  componentWillUnmount() {
    const { clearGetMachinePoolsResponse, clearDeleteMachinePoolResponse } = this.props;
    clearGetMachinePoolsResponse();
    clearDeleteMachinePoolResponse();
  }

  onCollapse = (event, rowKey, isOpen, rowData) => {
    this.setState(
      produce((draft) => {
        if (isOpen) {
          if (!draft.openedRows.includes(rowData.machinePool.id)) {
            draft.openedRows.push(rowData.machinePool.id);
          }
        } else {
          draft.openedRows = draft.openedRows.filter(
            (machinePoolId) => machinePoolId !== rowData.machinePool.id,
          );
        }
      }),
    );
  };

  render() {
    const {
      cluster,
      machinePoolsList,
      openModal,
      isDeleteMachinePoolModalOpen,
      deleteMachinePool,
      deleteMachinePoolResponse,
      hasMachinePoolsQuota,
      clusterAutoscalerResponse,
      canMachinePoolBeUpdated,
      machineTypes,
      getMachinePools,
      isClusterAutoscalingModalOpen,
    } = this.props;

    const {
      deletedRowIndex,
      openedRows,
      hideDeleteMachinePoolError,
      addMachinePool,
      editMachinePoolId,
    } = this.state;
    const machinePoolsActions = cluster?.machinePoolsActions || {}; // Data not defined on the cluster list response
    const hasMachinePools = !!machinePoolsList.data.length;
    const isMultiZoneCluster = isMultiAZ(cluster);
    const hasAutoscalingMachinePools = hasDefaultOrExplicitAutoscalingMachinePool(
      cluster,
      machinePoolsList?.data,
    );
    const isHypershift = isHypershiftCluster(cluster);
    const isRosa = isROSA(cluster);

    if (hasMachinePools && machinePoolsList.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
        </EmptyState>
      );
    }

    const refreshMachinePools = () => {
      if (!machinePoolsList.pending) {
        getMachinePools();
      }
    };

    const columns = [
      { title: 'Machine pool', cellFormatters: [expandable] },
      { title: 'Instance type' },
      { title: 'Availability zones', transforms: [cellWidth(15)] },
    ];
    columns.push({ title: 'Node count' });
    columns.push({ title: 'Autoscaling', transforms: [cellWidth(15)] });
    if (isHypershift) {
      columns.push({ title: 'Version', transforms: [cellWidth(15)] });
    }

    const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason =
      isHibernating(cluster) && 'This operation is not available while cluster is hibernating';
    const canNotCreateReason =
      !machinePoolsActions.create &&
      'You do not have permission to add a machine pool. Only cluster owners, cluster editors, machine pool editors and Organization Administrators can add machine pools.';
    const quotaReason = !hasMachinePoolsQuota && noQuotaTooltip;
    const canNotEditReason =
      !machinePoolsActions.update &&
      'You do not have permission to edit machine pools. Only cluster owners, cluster editors, machine pool editors and Organization Administrators can edit machine pools.';

    const canNotEditAutoscalerReason =
      (!cluster?.canEditClusterAutoscaler &&
        'You do not have permission to edit the cluster autoscaler.') ||
      (clusterAutoscalerResponse.hasAutoscaler &&
        !clusterAutoscalerResponse.getAutoscaler.data &&
        'The cluster autoscaler is loading.');

    const tableActionsDisabled = !!(readOnlyReason || hibernatingReason || canNotEditReason);

    const getMachinePoolRow = (machinePool = {}, isExpandableRow) => {
      const cells = [
        machinePool.id,
        {
          title: (
            <>
              {isHypershift ? machinePool.aws_node_pool?.instance_type : machinePool.instance_type}
              {machinePool.aws?.spot_market_options && (
                <Label variant="outline" className="ocm-c-machine-pools__spot-label">
                  Spot
                </Label>
              )}
            </>
          ),
        },
        machinePool.availability_zones?.join(', ') || machinePool.availability_zone,
        {
          title: (
            <MachinePoolNodesSummary
              isMultiZoneCluster={isMultiZoneCluster}
              machinePool={machinePool}
            />
          ),
        },
        {
          title: machinePool.autoscaling ? 'Enabled' : 'Disabled',
        },
        isHypershift ? { title: getOpenShiftVersion(machinePool, tableActionsDisabled) } : null,
      ].filter((column) => column !== null);

      const row = {
        cells,
        key: machinePool.id,
        machinePool,
      };
      if (isExpandableRow) {
        row.isOpen = openedRows.includes(machinePool.id);
      }
      return row;
    };

    const getExpandableRow = (machinePool, parentIndex) => ({
      parent: parentIndex,
      fullWidth: true,
      cells: [
        {
          title: (
            <MachinePoolExpandedRow
              cluster={cluster}
              isMultiZoneCluster={isMultiZoneCluster}
              machinePool={machinePool}
            />
          ),
        },
      ],
      key: `${machinePool.id}-child`,
    });

    // row is expandable if there are extra details to show
    const isExpandable = (machinePool = {}) =>
      !isEmpty(machinePool.labels) ||
      machinePool.taints?.length > 0 ||
      machinePool.autoscaling ||
      machinePool.aws ||
      hasSubnets(machinePool);

    const rows = [];

    // set all other machine pools rows
    machinePoolsList.data.forEach((machinePool) => {
      const isExpandableRow = isExpandable(machinePool);
      const machinePoolRow = getMachinePoolRow(machinePool, isExpandableRow);

      rows.push(machinePoolRow);

      if (isExpandableRow) {
        const expandableRow = getExpandableRow(machinePool, rows.length - 1);
        rows.push(expandableRow);
      }
    });

    const performDeleteAction = (rowID, rowData) => {
      this.setState(
        produce((draft) => {
          if (deleteMachinePoolResponse.error) {
            draft.hideDeleteMachinePoolError = false;
          }
          draft.deletedRowIndex = rowID;
          draft.openedRows = draft.openedRows.filter(
            (machinePoolId) => machinePoolId !== rowData.machinePool.id,
          );
        }),
      );
      deleteMachinePool(rowData.machinePool.id);
    };

    const onClickDeleteAction = (_, rowID, rowData) => {
      openModal(modals.DELETE_MACHINE_POOL, {
        machinePool: rowData.machinePool,
        performDeleteAction: () => performDeleteAction(rowID, rowData),
      });
    };

    const onClickEdit = (_, __, rowData) =>
      this.setState(
        produce((draft) => {
          draft.editMachinePoolId = rowData.machinePool.id;
        }),
      );

    const onClickUpdateAction = (_, __, rowData) =>
      openModal(modals.UPDATE_MACHINE_POOL_VERSION, {
        machinePool: rowData.machinePool,
      });

    const showSkeleton = !hasMachinePools && machinePoolsList.pending;
    const skeletonRow = {
      cells: [
        {
          props: { colSpan: 4 },
          title: <Skeleton size="lg" />,
        },
      ],
    };

    if (hasMachinePools && machinePoolsList.pending && deletedRowIndex === null) {
      rows.push(skeletonRow);
    }

    if (hasMachinePools && deletedRowIndex !== null) {
      // when deleting a row check if the row is expandable
      if (rows[deletedRowIndex + 1]?.parent) {
        // remove the child row
        rows.splice(deletedRowIndex + 1, 1);
      }

      rows[deletedRowIndex] = skeletonRow;
    }

    return (
      <>
        {showSkeleton ? (
          <Card>
            <CardTitle>
              <Skeleton size="lg" />
            </CardTitle>
            <CardBody>
              <Skeleton size="lg" />
            </CardBody>
            <CardFooter>
              <Skeleton size="lg" />
            </CardFooter>
          </Card>
        ) : (
          <>
            {!tableActionsDisabled && <UpdateAllMachinePools />}
            <Card className="ocm-c-machine-pools__card">
              <CardBody className="ocm-c-machine-pools__card--body">
                {machinePoolsList.error && (
                  <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
                )}
                <ButtonWithTooltip
                  disableReason={
                    readOnlyReason || hibernatingReason || canNotCreateReason || quotaReason
                  }
                  id="add-machine-pool"
                  onClick={() =>
                    this.setState(
                      produce((draft) => {
                        draft.addMachinePool = true;
                      }),
                    )
                  }
                  variant="secondary"
                  className="pf-u-mb-lg pf-u-mr-md"
                >
                  Add machine pool
                </ButtonWithTooltip>
                {!isHypershift && (
                  <ButtonWithTooltip
                    id="edit-existing-cluster-autoscaling"
                    disableReason={
                      readOnlyReason || hibernatingReason || canNotEditAutoscalerReason
                    }
                    onClick={() => openModal(modals.EDIT_CLUSTER_AUTOSCALING_V1)}
                    variant="secondary"
                    className="pf-u-mb-lg"
                  >
                    Edit cluster autoscaling
                  </ButtonWithTooltip>
                )}
                <Divider />
                {deleteMachinePoolResponse.error && !hideDeleteMachinePoolError && (
                  <ErrorBox
                    message="Error deleting machine pool"
                    response={deleteMachinePoolResponse}
                    showCloseBtn
                    onCloseAlert={() =>
                      this.setState(
                        produce((draft) => {
                          draft.hideDeleteMachinePoolError = true;
                        }),
                      )
                    }
                  />
                )}
                {machinePoolsActions.list && (
                  <Table
                    aria-label="Machine pools"
                    cells={columns}
                    rows={rows}
                    onCollapse={this.onCollapse}
                    actionResolver={(rowData) =>
                      actionResolver({
                        rowData,
                        onClickDelete: onClickDeleteAction,
                        onClickUpdate: canMachinePoolBeUpdated(rowData.machinePool)
                          ? onClickUpdateAction
                          : undefined,
                        canDelete: machinePoolsActions.delete,
                        cluster,
                        machinePools: machinePoolsList.data,
                        machineTypes,
                        onClickEdit,
                      })
                    }
                    areActionsDisabled={() => tableActionsDisabled}
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                )}
              </CardBody>
            </Card>
          </>
        )}
        {isDeleteMachinePoolModalOpen && <DeleteMachinePoolModal />}
        {(!!editMachinePoolId || addMachinePool) && (
          <EditMachinePoolModal
            cluster={cluster}
            onSave={refreshMachinePools}
            onClose={() =>
              this.setState(
                produce((draft) => {
                  draft.editMachinePoolId = undefined;
                  draft.addMachinePool = false;
                }),
              )
            }
            machinePoolId={editMachinePoolId}
            machinePoolsResponse={machinePoolsList}
            machineTypesResponse={machineTypes}
          />
        )}
        <UpdateMachinePoolModal />
        {isClusterAutoscalingModalOpen && (
          <EditClusterAutoScalerForDay2
            isWizard={false}
            isRosa={isRosa}
            clusterId={cluster.id}
            hasAutoscalingMachinePools={hasAutoscalingMachinePools}
            clusterAutoscalerResponse={clusterAutoscalerResponse}
          />
        )}
      </>
    );
  }
}

MachinePools.propTypes = {
  cluster: PropTypes.object.isRequired,
  clusterAutoscalerResponse: PropTypes.shape({
    editAction: PropTypes.object.isRequired,
    getAutoscaler: PropTypes.object.isRequired,
    hasAutoscaler: PropTypes.bool,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  hasMachinePoolsQuota: PropTypes.bool.isRequired,
  isDeleteMachinePoolModalOpen: PropTypes.bool.isRequired,
  isClusterAutoscalingModalOpen: PropTypes.bool.isRequired,
  deleteMachinePoolResponse: PropTypes.object.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  deleteMachinePool: PropTypes.func.isRequired,
  getClusterAutoscaler: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
  clearDeleteMachinePoolResponse: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  canMachinePoolBeUpdated: PropTypes.func,
};

export default MachinePools;
