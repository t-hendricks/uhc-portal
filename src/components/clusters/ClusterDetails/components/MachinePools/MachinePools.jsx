import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import {
  Card,
  Button,
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  EmptyState,
  Label,
  Popover,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, cellWidth, expandable } from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import { isRestrictedEnv } from '~/restrictedEnv';
import {
  UpdateAllMachinePools,
  UpdatePoolButton,
  UpdateMachinePoolModal,
} from './UpdateMachinePools';
import AddMachinePoolModal from './components/AddMachinePoolModal';
import EditTaintsModal from './components/EditTaintsModal';
import EditLabelsModal from './components/EditLabelsModal';
import { actionResolver, hasSubnets } from './machinePoolsHelper';
import ExpandableRow from './components/ExpandableRow';

import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import ErrorBox from '../../../../common/ErrorBox';
import modals from '../../../../common/Modal/modals';

import { noQuotaTooltip } from '../../../../../common/helpers';
import { versionFormatter } from '../../../../../common/versionFormatter';
import { isHibernating } from '../../../common/clusterStates';
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
      addMachinePoolResponse,
      scaleMachinePoolResponse,
      getMachinePools,
      machinePoolsList,
      getOrganizationAndQuota,
    } = this.props;
    const { deletedRowIndex } = this.state;

    if (
      ((deleteMachinePoolResponse.fulfilled && prevProps.deleteMachinePoolResponse.pending) ||
        (addMachinePoolResponse.fulfilled && prevProps.addMachinePoolResponse.pending) ||
        (scaleMachinePoolResponse.fulfilled && prevProps.scaleMachinePoolResponse.pending)) &&
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
      isAddMachinePoolModalOpen,
      isEditTaintsModalOpen,
      isEditLabelsModalOpen,
      deleteMachinePool,
      defaultMachinePool,
      deleteMachinePoolResponse,
      addMachinePoolResponse,
      hasMachinePoolsQuota,
      isHypershift,
      canMachinePoolBeUpdated,
    } = this.props;

    const { deletedRowIndex, openedRows, hideDeleteMachinePoolError } = this.state;

    const hasMachinePools = !!machinePoolsList.data.length;

    if (hasMachinePools && machinePoolsList.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
        </EmptyState>
      );
    }

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
      isHibernating(cluster.state) &&
      'This operation is not available while cluster is hibernating';
    const canNotCreateReason =
      !cluster.canEdit &&
      !cluster.canCreateMachinePools &&
      'You do not have permission to add a machine pool. Only cluster owners, cluster editors, machine pool editors and Organization Administrators can add machine pools.';
    const quotaReason = !hasMachinePoolsQuota && noQuotaTooltip;
    const canNotEditReason =
      !cluster.canEdit &&
      !cluster.canEditMachinePools &&
      'You do not have permission to edit machine pools. Only cluster owners, cluster editors, machine pool editors and Organization Administrators can edit machine pools.';

    const addMachinePoolBtn = (
      <ButtonWithTooltip
        disableReason={readOnlyReason || hibernatingReason || canNotCreateReason || quotaReason}
        id="add-machine-pool"
        onClick={() => openModal('add-machine-pool')}
        variant="secondary"
        className="pf-u-mb-lg"
      >
        Add machine pool
      </ButtonWithTooltip>
    );

    const tableActionsDisabled = !!(readOnlyReason || hibernatingReason || canNotEditReason);

    const getMachinePoolRow = (machinePool = {}, isExpandableRow) => {
      const autoscalingEnabled = machinePool.autoscaling;
      let nodes;

      if (autoscalingEnabled) {
        const autoScaleNodesText = `Min: ${machinePool.autoscaling.min_replicas}, Max: ${machinePool.autoscaling.max_replicas}`;
        nodes = cluster.multi_az ? (
          <>
            <Popover
              bodyContent="Minimum and maximum node totals are calculated based on the number of zones."
              aria-label="help"
            >
              <Button className="nodes-count" variant="link">
                {autoScaleNodesText}
              </Button>
            </Popover>
          </>
        ) : (
          autoScaleNodesText
        );
      } else {
        nodes = `${machinePool.desired || machinePool.replicas}`;
      }

      const cells = [
        machinePool.id,
        {
          title: (
            <>
              {isHypershift && machinePool.id !== 'Default'
                ? machinePool.aws_node_pool?.instance_type
                : machinePool.instance_type}
              {machinePool.aws && (
                <Label variant="outline" className="ocm-c-machine-pools__spot-label">
                  Spot
                </Label>
              )}
            </>
          ),
        },
        machinePool.availability_zones?.join(', ') || machinePool.availability_zone,
        { title: nodes },
        autoscalingEnabled ? 'Enabled' : 'Disabled',
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
          title: <ExpandableRow cluster={cluster} machinePool={machinePool} />,
        },
      ],
      key: `${machinePool.id}-child`,
    });

    // row is expandable if autoscaling enabled, or it has lables, or taints
    const isExpandable = (machinePool = {}) =>
      !isEmpty(machinePool.labels) ||
      machinePool.taints?.length > 0 ||
      machinePool.autoscaling ||
      machinePool.aws ||
      hasSubnets(machinePool);

    const rows = [];

    if (!isHypershift) {
      const isDefaultExpandable = isExpandable(defaultMachinePool);

      // initialize rows array with default machine pool row
      rows.push(getMachinePoolRow(defaultMachinePool, isDefaultExpandable));

      if (isDefaultExpandable) {
        // add default machine pool expandable row
        rows.push(getExpandableRow(defaultMachinePool, 0));
      }
    }

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

    const onClickDeleteAction = (_, rowID, rowData) => {
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

    const onClickScaleAction = (_, __, rowData) =>
      openModal(modals.EDIT_NODE_COUNT, {
        machinePool: rowData.machinePool,
        isDefaultMachinePool: rowData.machinePool.id === 'Default' && !isHypershift,
        cluster,
      });

    const onClickEditTaintsAction = (_, __, rowData) =>
      openModal(modals.EDIT_TAINTS, {
        machinePool: rowData.machinePool,
      });

    const onClickEditLabelsAction = (_, __, rowData) =>
      openModal(modals.EDIT_LABELS, {
        machinePool: rowData.machinePool,
      });

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

    if (
      hasMachinePools &&
      (machinePoolsList.pending || addMachinePoolResponse.pending) &&
      deletedRowIndex === null
    ) {
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
            {!tableActionsDisabled ? <UpdateAllMachinePools /> : null}
            <Card className="ocm-c-machine-pools__card">
              <CardBody className="ocm-c-machine-pools__card--body">
                {machinePoolsList.error && (
                  <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
                )}
                {!isRestrictedEnv() && addMachinePoolBtn}
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
                <Table
                  aria-label="Machine pools"
                  cells={columns}
                  rows={rows}
                  onCollapse={this.onCollapse}
                  actionResolver={
                    !isRestrictedEnv()
                      ? (rowData) =>
                          actionResolver(
                            rowData,
                            onClickDeleteAction,
                            onClickScaleAction,
                            onClickEditTaintsAction,
                            onClickEditLabelsAction,
                            isHypershift,
                            machinePoolsList.data.length,
                            canMachinePoolBeUpdated(rowData.machinePool)
                              ? onClickUpdateAction
                              : undefined,
                          )
                      : undefined
                  }
                  areActionsDisabled={() => tableActionsDisabled}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              </CardBody>
            </Card>
          </>
        )}
        {isAddMachinePoolModalOpen && (
          <AddMachinePoolModal cluster={cluster} isHypershiftCluster={isHypershift} />
        )}
        {isEditTaintsModalOpen && (
          <EditTaintsModal clusterId={cluster.id} isHypershiftCluster={isHypershift} />
        )}
        {isEditLabelsModalOpen && (
          <EditLabelsModal clusterId={cluster.id} isHypershiftCluster={isHypershift} />
        )}
        <UpdateMachinePoolModal />
      </>
    );
  }
}

const checkNodesAtLeastOne = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (!props.desired && !props.autoscaling) {
    return new Error('One of props "desired" or "autoscaling" was not specified in MachinePools.');
  }
  return null;
};

MachinePools.propTypes = {
  cluster: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  hasMachinePoolsQuota: PropTypes.bool.isRequired,
  isAddMachinePoolModalOpen: PropTypes.bool.isRequired,
  isEditTaintsModalOpen: PropTypes.bool.isRequired,
  isEditLabelsModalOpen: PropTypes.bool.isRequired,
  deleteMachinePoolResponse: PropTypes.object.isRequired,
  addMachinePoolResponse: PropTypes.object.isRequired,
  scaleMachinePoolResponse: PropTypes.object.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  defaultMachinePool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    instance_type: PropTypes.string.isRequired,
    availability_zones: PropTypes.array.isRequired,
    desired: checkNodesAtLeastOne,
    autoscaling: checkNodesAtLeastOne,
    labels: PropTypes.objectOf(PropTypes.string),
  }),
  getMachinePools: PropTypes.func.isRequired,
  deleteMachinePool: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
  clearDeleteMachinePoolResponse: PropTypes.func.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  isHypershift: PropTypes.bool,
  canMachinePoolBeUpdated: PropTypes.func,
};

export default MachinePools;
