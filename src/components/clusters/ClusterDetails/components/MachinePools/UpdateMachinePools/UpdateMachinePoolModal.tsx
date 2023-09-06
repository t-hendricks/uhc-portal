import React from 'react';
import { Button, Alert, AlertVariant, ButtonVariant } from '@patternfly/react-core';
import { OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';
import { useSelector, useDispatch } from 'react-redux';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import Modal from '~/components/common/Modal/Modal';
import modalIds from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { modalActions } from '~/components/common/Modal/ModalActions';
import { GlobalState } from '~/redux/store';
import {
  useControlPlaneUpToDate,
  useMachinePoolBehindControlPlane,
  controlPlaneVersionSelector,
  displayControlPlaneVersion,
  updateAllMachinePools as updatePool,
  controlPlaneIdSelector,
} from './updateMachinePoolsHelpers';

import { isHypershiftCluster } from '../../../clusterDetailsHelper';
import { getMachineOrNodePools } from '../MachinePoolsActions';

const updateModalId = modalIds.UPDATE_MACHINE_POOL_VERSION;

export const UpdatePoolButton = ({ machinePool }: { machinePool: NodePool }) => {
  const dispatch = useDispatch();
  const controlPlaneUpToDate = useControlPlaneUpToDate();
  const machinePoolCanBeUpdated = useMachinePoolBehindControlPlane(machinePool);

  if (!controlPlaneUpToDate || !machinePoolCanBeUpdated) {
    return null;
  }
  return (
    <>
      <Button
        variant={ButtonVariant.link}
        isInline
        onClick={() => dispatch(modalActions.openModal(updateModalId, { machinePool }))}
      >
        Update <OutlinedArrowAltCircleUpIcon />
      </Button>
    </>
  );
};

export const UpdateMachinePoolModal = () => {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');
  const isHypershift = useSelector((state: GlobalState) =>
    isHypershiftCluster(state.clusters.details.cluster),
  );
  const clusterId = useSelector(controlPlaneIdSelector);
  const controlPlaneVersion = useSelector(controlPlaneVersionSelector);
  const isModalOpen = useSelector((state: GlobalState) => shouldShowModal(state, updateModalId));
  // @ts-ignore
  const modalData: { machinePool: NodePool } = useSelector(
    (state: GlobalState) => state.modal.data,
  );

  const { machinePool } = modalData;
  const dispatch = useDispatch();
  const cleanUp = () => {
    dispatch(modalActions.closeModal());
    setError('');
    setPending(false);
  };
  React.useEffect(
    () =>
      function cleanup() {
        cleanUp();
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!isModalOpen) {
    return null;
  }

  const updateNodePool = async () => {
    setPending(true);
    const errors = await updatePool([machinePool], clusterId, controlPlaneVersion || '');

    setPending(false);
    setError(errors[0] || '');
    // @ts-ignore
    dispatch(getMachineOrNodePools(clusterId, isHypershift));

    if (!errors[0]) {
      dispatch(modalActions.closeModal());
    }
  };

  return (
    <Modal
      variant="small"
      title="Update machine pool"
      onClose={() => cleanUp()}
      primaryText="Update machine pool"
      secondaryText="Cancel"
      onPrimaryClick={updateNodePool}
      onSecondaryClick={() => cleanUp()}
      isPrimaryDisabled={pending || !!error}
      isPending={pending}
    >
      {!pending && !!error ? (
        <Alert
          title={`Machine pool ${machinePool.id} could not be updated`}
          variant={AlertVariant.danger}
          isExpandable
          isInline
          role="alert"
          className="pf-u-mt-md"
        >
          <p>{error}</p>
        </Alert>
      ) : (
        <p>
          Update machine pool {machinePool.id} to version{' '}
          {displayControlPlaneVersion(controlPlaneVersion)}?
        </p>
      )}
    </Modal>
  );
};
