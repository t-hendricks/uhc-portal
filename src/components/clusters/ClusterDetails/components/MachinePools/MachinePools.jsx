import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Button, CardBody, CardFooter, Tooltip, CardTitle, Divider, EmptyState,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
} from '@patternfly/react-table';
import {
  Skeleton,
} from '@redhat-cloud-services/frontend-components';

import ErrorBox from '../../../../common/ErrorBox';

import AddMachinePoolModal from './components/AddMachinePoolModal';
import ScaleMachinePoolModal from './components/ScaleMachinePoolModal';

class MachinePools extends React.Component {
  state = {
    deletedRowIndex: null,
  };

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
      && getMachinePools.fulfilled && deletedRowIndex !== null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ deletedRowIndex: null });
    }
  }

  componentWillUnmount() {
    const { clearGetMachinePoolsResponse } = this.props;
    clearGetMachinePoolsResponse();
  }

  render() {
    const {
      cluster,
      machinePoolsList,
      openModal,
      isAddMachinePoolModalOpen,
      isScaleMachinePoolModalOpen,
      deleteMachinePool,
      defaultMachinePool,
      deleteMachinePoolResponse,
    } = this.props;

    const { deletedRowIndex } = this.state;

    const hasMachinePools = !!machinePoolsList.data.length;

    if (hasMachinePools && machinePoolsList.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error retrieving machine pools" response={machinePoolsList} />
        </EmptyState>
      );
    }

    const columns = [
      { title: 'Machine pool', transforms: [cellWidth(25)] },
      { title: 'Instance type', transforms: [cellWidth(25)] },
      { title: 'Availablity zone ID', transforms: [cellWidth(25)] },
      { title: 'Node count', transforms: [cellWidth(25)] },
    ];

    const machinePoolRow = machinePool => ({
      cells: [
        machinePool.id,
        machinePool.instance_type,
      machinePool.availability_zones?.join(', '),
      `${machinePool.desired || machinePool.replicas}`,
      ],
      machinePool,
    });

    const rows = [machinePoolRow(defaultMachinePool), ...machinePoolsList.data.map(machinePoolRow)];


    const onClickDeleteActions = (_, rowID, rowData) => {
      this.setState({ deletedRowIndex: rowID });
      deleteMachinePool(rowData.machinePool.id);
    };

    const onClickScaleActions = (_, __, rowData) => openModal('scale-machine-pool', {
      machinePool: rowData.machinePool,
      isDefaultMachinePool: rowData.machinePool.id === 'Default',
    });


    const actionResolver = (rowData) => {
      // hide delete action for default machine pool
      const deleteAction = rowData.machinePool?.id !== 'Default'
        ? [{
          title: 'Delete',
          onClick: onClickDeleteActions,
          className: 'hand-pointer',
        }] : [];

      return [
        {
          title: 'Scale',
          onClick: onClickScaleActions,
          className: 'hand-pointer',
        },
        ...deleteAction,
      ];
    };

    const showSkeleton = !hasMachinePools && machinePoolsList.pending;
    const skeletonRow = {
      cells: [
        {
          props: { colSpan: 4 },
          title: <Skeleton size="lg" />,
        },
      ],
    };

    if (hasMachinePools && deleteMachinePoolResponse.pending && deletedRowIndex !== null) {
      rows[deletedRowIndex] = skeletonRow;
    }

    const addMachinePoolBtn = (
      <Button onClick={() => openModal('add-machine-pool')} variant="secondary" className="space-bottom-lg" isDisabled={!cluster.canEdit}>
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
          <Card>
            <CardBody>
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
                actionResolver={actionResolver}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </CardBody>
          </Card>
        )}
        {isAddMachinePoolModalOpen && <AddMachinePoolModal cluster={cluster} />}
        {isScaleMachinePoolModalOpen && <ScaleMachinePoolModal cluster={cluster} />}
      </>
    );
  }
}

MachinePools.propTypes = {
  cluster: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  isAddMachinePoolModalOpen: PropTypes.bool.isRequired,
  isScaleMachinePoolModalOpen: PropTypes.bool.isRequired,
  deleteMachinePoolResponse: PropTypes.object.isRequired,
  addMachinePoolResponse: PropTypes.object.isRequired,
  scaleMachinePoolResponse: PropTypes.object.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  defaultMachinePool: PropTypes.object.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  deleteMachinePool: PropTypes.func.isRequired,
  clearGetMachinePoolsResponse: PropTypes.func.isRequired,
};

export default MachinePools;
