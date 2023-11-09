import React from 'react';
import { Button, Alert, AlertVariant, ButtonVariant } from '@patternfly/react-core';
import { OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '~/components/common/Modal/Modal';
import modalIds from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { modalActions } from '~/components/common/Modal/ModalActions';
import { GlobalState } from '~/redux/store';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HCP_USE_NODE_UPGRADE_POLICIES } from '~/redux/constants/featureConstants';
import PopoverHint from '~/components/common/PopoverHint';
import {
  useMachinePoolBehindControlPlane,
  useHCPControlPlaneUpdating,
  controlPlaneVersionSelector,
  displayControlPlaneVersion,
  updateAllMachinePools as updatePool,
  controlPlaneIdSelector,
  useIsControlPlaneValidForMachinePool,
  isMachinePoolUpgrading,
  isMachinePoolScheduleError,
} from './updateMachinePoolsHelpers';

import { NodePoolWithUpgradePolicies } from '../machinePoolCustomTypes';
import { getMachineOrNodePools } from '../MachinePoolsActions';

const updateModalId = modalIds.UPDATE_MACHINE_POOL_VERSION;

export const UpdatePoolButton = ({ machinePool }: { machinePool: NodePoolWithUpgradePolicies }) => {
  const dispatch = useDispatch();
  const controlPlaneVersion = useSelector((state: GlobalState) =>
    controlPlaneVersionSelector(state),
  );
  const machinePoolBehindControlPlane = useMachinePoolBehindControlPlane(machinePool);
  const controlPlaneUpdating = useHCPControlPlaneUpdating();
  const isAvailableVersion = useIsControlPlaneValidForMachinePool(machinePool);
  const machinePoolUpdating = isMachinePoolUpgrading(machinePool);

  if (controlPlaneUpdating || !machinePoolBehindControlPlane) {
    return null;
  }

  if (isMachinePoolScheduleError(machinePool)) {
    return (
      <PopoverHint
        iconClassName={spacing.mlSm}
        isError
        hint={machinePool.upgradePolicies?.errorMessage}
      />
    );
  }

  if (!isAvailableVersion) {
    return (
      <PopoverHint
        iconClassName={spacing.mlSm}
        hint={`This machine pool cannot be updated because there isn't a migration path to version ${controlPlaneVersion}`}
      />
    );
  }

  if (machinePoolUpdating) {
    const scheduledMessage = 'This machine pool is scheduled to be updated';

    const schedule = machinePool.upgradePolicies?.items?.[0];

    if (schedule?.next_run && schedule?.version) {
      return (
        <PopoverHint
          iconClassName={spacing.mlSm}
          hint={
            <>
              {scheduledMessage} at <DateFormat type="exact" date={Date.parse(schedule.next_run)} />{' '}
              to version {schedule.version}
            </>
          }
        />
      );
    }

    return <PopoverHint iconClassName={spacing.mlSm} hint={scheduledMessage} />;
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

  const useNodeUpdatePolicies = useFeatureGate(HCP_USE_NODE_UPGRADE_POLICIES);
  const clusterId = useSelector(controlPlaneIdSelector);
  const controlPlaneVersion = useSelector((state: GlobalState) =>
    controlPlaneVersionSelector(state),
  );
  const isModalOpen = useSelector((state: GlobalState) => shouldShowModal(state, updateModalId));
  // @ts-ignore - useSelector is return as "any"
  const modalData: { machinePool: NodePoolWithUpgradePolicies } = useSelector(
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
    const errors = await updatePool(
      [machinePool],
      clusterId,
      controlPlaneVersion || '',
      useNodeUpdatePolicies,
    );

    setPending(false);
    setError(errors[0] || '');

    dispatch(
      // @ts-ignore -issue with dispatch type
      getMachineOrNodePools(clusterId, isHypershift, controlPlaneVersion, useNodeUpdatePolicies),
    );

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
