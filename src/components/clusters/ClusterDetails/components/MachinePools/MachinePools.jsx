import React from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import {
  Card, Button, CardBody, CardFooter, Tooltip, CardTitle, Divider, EmptyState, Label, Title,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
  expandable,
} from '@patternfly/react-table';
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';

import ErrorBox from '../../../../common/ErrorBox';
import modals from '../../../../common/Modal/modals';

import AddMachinePoolModal from './components/AddMachinePoolModal';
import './MachinePools.scss';
import actionResolver from './machinePoolsHelper';

const initialState = {
  deletedRowIndex: null,
  openedRows: [],
};

class MachinePools extends React.Component {
  state = initialState;

  componentDidMount() {
    const { machinePoolsList, getMachinePools } = this.props;
    if (!machinePoolsList.pending) {
      getMachinePools();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deleteMachinePoolResponse,
      addMachinePoolResponse,
      scaleMachinePoolResponse,
      getMachinePools,
      machinePoolsList,
    } = this.props;
    const { deletedRowIndex } = this.state;

    if (((deleteMachinePoolResponse.fulfilled && prevProps.deleteMachinePoolResponse.pending)
      || (addMachinePoolResponse.fulfilled && prevProps.addMachinePoolResponse.pending)
      || (scaleMachinePoolResponse.fulfilled && prevProps.scaleMachinePoolResponse.pending))
      && (!machinePoolsList.pending)
    ) {
      getMachinePools();
    }

    if (prevProps.machinePoolsList.pending
      && machinePoolsList.fulfilled && deletedRowIndex !== null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(produce((draft) => { draft.deletedRowIndex = null; }));
    }
  }

  componentWillUnmount() {
    const { clearGetMachinePoolsResponse } = this.props;
    clearGetMachinePoolsResponse();
  }

  onCollapse = (event, rowKey, isOpen, rowData) => {
    this.setState(produce((draft) => {
      if (isOpen) {
        if (!(draft.openedRows.includes(rowData.machinePool.id))) {
          draft.openedRows.push(rowData.machinePool.id);
        }
      } else {
        draft.openedRows = draft.openedRows.filter(
          machinePoolId => machinePoolId !== rowData.machinePool.id,
        );
      }
    }));
  }

  render() {
    const {
      cluster,
      machinePoolsList,
      openModal,
      isAddMachinePoolModalOpen,
      deleteMachinePool,
      defaultMachinePool,
      deleteMachinePoolResponse,
      addMachinePoolResponse,
    } = this.props;

    const { deletedRowIndex, openedRows } = this.state;

    const hasMachinePools = !!machinePoolsList.data.length;

    if (hasMachinePools && machinePoolsList.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
        </EmptyState>
      );
    }

    const columns = [
      { title: 'Machine pool', transforms: [cellWidth(25)], cellFormatters: [expandable] },
      { title: 'Instance type', transforms: [cellWidth(25)] },
      { title: 'Availability zones', transforms: [cellWidth(25)] },
      { title: 'Node count', transforms: [cellWidth(25)] },
    ];

    const getMachinePoolRow = (machinePool, isExpandableRow) => {
      const row = (
        {
          cells: [
            machinePool.id,
            machinePool.instance_type,
            machinePool.availability_zones?.join(', '),
            `${machinePool.desired || machinePool.replicas}`,
          ],
          key: machinePool.id,
          machinePool,
        }
      );
      if (isExpandableRow) {
        row.isOpen = openedRows.includes(machinePool.id);
      }
      return row;
    };

    const getExpandableRow = (machinePool, parentIndex) => {
      const { labels, taints } = machinePool;
      const labelsKeys = !isEmpty(labels) ? Object.keys(labels) : [];

      const labelsList = labelsKeys.length ? labelsKeys.map(key => (
        <React.Fragment key={`laebl-${key}`}>
          <Label color="blue">{`${[key]} = ${labels[key]}`}</Label>
          {' '}
        </React.Fragment>
      )) : null;

      const taintsList = taints?.map(taint => (
        <React.Fragment key={`taint-${taint.key}`}>
          <Label color="blue">{`${taint.key} = ${taint.value}:${taint.effect}`}</Label>
          {' '}
        </React.Fragment>
      ));

      const expandableRowContent = (
        <>
          {labelsList && (
            <>
              <Title headingLevel="h4" className="space-bottom-sm">Labels</Title>
              {labelsList}
            </>
          )}
          {taintsList && (
            <>
              <Title headingLevel="h4" className={cx('space-bottom-sm', labelsList && 'space-top-lg')}>Taints</Title>
              {taintsList}
            </>
          )}

        </>
      );

      return (
        {
          parent: parentIndex,
          fullWidth: true,
          cells: [{
            title: expandableRowContent,
          }],
          key: `${machinePool.id}-child`,
        }
      );
    };

    // row is expandable if it has either labels or taints
    const isExpandable = (labels, taints) => !isEmpty(labels) || taints?.length > 0;

    const isDefaultExpandable = isExpandable(defaultMachinePool.labels, null);

    // initialize rows array with default machine pool row
    const rows = [getMachinePoolRow(defaultMachinePool, isDefaultExpandable)];

    if (isDefaultExpandable) {
      // add default machine pool expandable row
      rows.push(getExpandableRow(defaultMachinePool, 0));
    }

    // set all other machine pools rows
    machinePoolsList.data.forEach((machinePool) => {
      const isExpandableRow = isExpandable(machinePool.labels, machinePool.taints);
      const machinePoolRow = getMachinePoolRow(machinePool, isExpandableRow);

      rows.push(machinePoolRow);

      if (isExpandableRow) {
        const expandableRow = getExpandableRow(machinePool, rows.length - 1);

        rows.push(expandableRow);
      }
    });

    const onClickDeleteAction = (_, rowID, rowData) => {
      this.setState(produce((draft) => {
        draft.deletedRowIndex = rowID;
        draft.openedRows = draft.openedRows.filter(
          machinePoolId => machinePoolId !== rowData.machinePool.id,
        );
      }));
      deleteMachinePool(rowData.machinePool.id);
    };

    const onClickScaleAction = (_, __, rowData) => openModal(modals.EDIT_NODE_COUNT, {
      machinePool: rowData.machinePool,
      isDefaultMachinePool: rowData.machinePool.id === 'Default',
      cluster,
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

    if (hasMachinePools && (machinePoolsList.pending || addMachinePoolResponse.pending)
    && deletedRowIndex === null) {
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

    const addMachinePoolBtn = (
      <Button id="add-machine-pool" onClick={() => openModal('add-machine-pool')} variant="secondary" className="space-bottom-lg" isDisabled={!cluster.canEdit}>
        Add machine pool
      </Button>
    );

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
          <Card className="ocm-c-machine-pools__card">
            <CardBody className="ocm-c-machine-pools__card--body">
              { machinePoolsList.error && (
              <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
              )}
              {!cluster.canEdit ? (
                <Tooltip content="You do not have permission to add a machine pool. Only cluster owners and organization administrators can add machine pools.">
                  <span>
                    {addMachinePoolBtn}
                  </span>
                </Tooltip>
              )
                : addMachinePoolBtn}
              <Divider />
              { deleteMachinePoolResponse.error && (
              <ErrorBox message="Error deleting machine pool" response={machinePoolsList} />
              )}
              <Table
                aria-label="Machine pools"
                cells={columns}
                rows={rows}
                onCollapse={this.onCollapse}
                actionResolver={
                  rowData => actionResolver(rowData, onClickDeleteAction, onClickScaleAction)
                }
                areActionsDisabled={() => !cluster.canEdit}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </CardBody>
          </Card>
        )}
        {isAddMachinePoolModalOpen && <AddMachinePoolModal cluster={cluster} />}
      </>
    );
  }
}

MachinePools.propTypes = {
  cluster: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  isAddMachinePoolModalOpen: PropTypes.bool.isRequired,
  deleteMachinePoolResponse: PropTypes.object.isRequired,
  addMachinePoolResponse: PropTypes.object.isRequired,
  scaleMachinePoolResponse: PropTypes.object.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  defaultMachinePool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    instance_type: PropTypes.string.isRequired,
    availability_zones: PropTypes.array.isRequired,
    desired: PropTypes.number.isRequired,
    labels: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  getMachinePools: PropTypes.func.isRequired,
  deleteMachinePool: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
};

export default MachinePools;
