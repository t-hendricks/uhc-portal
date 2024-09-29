import * as React from 'react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import isEqual from 'lodash/isEqual';
import { useDispatch } from 'react-redux';

import { Button, ExpandableSection, Form, Stack, StackItem, Tooltip } from '@patternfly/react-core';

import { getErrorMessage } from '~/common/errors';
import { isMPoolAz } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { isHypershiftCluster, isROSA } from '~/components/clusters/common/clusterStates';
import { getMaxNodesHCP, getNodeCount } from '~/components/clusters/common/machinePools/utils';
import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { closeModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { MAX_COMPUTE_NODES_500 } from '~/redux/constants/featureConstants';
import { useGlobalState } from '~/redux/hooks';
import { GlobalState } from '~/redux/store';
import { PromiseReducerState } from '~/redux/types';
import { clusterService } from '~/services';
import { Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import { ErrorState } from '~/types/types';

import { clearGetMachinePoolsResponse, getMachineOrNodePools } from '../../MachinePoolsActions';
import { canUseSpotInstances, normalizeNodePool } from '../../machinePoolsHelper';

import DiskSizeField from './fields/DiskSizeField';
import useMachinePoolFormik, { EditMachinePoolValues } from './hooks/useMachinePoolFormik';
import useMachinePools from './hooks/useMachinePools';
import useMachineTypes from './hooks/useMachineTypes';
import EditDetailsSection from './sections/EditDetailsSection';
import EditLabelsSection from './sections/EditLabelsSection';
import EditNodeCountSection from './sections/EditNodeCountSection';
import EditTaintsSection from './sections/EditTaintsSection';
import EditSecurityGroupsSection from './sections/SecurityGroups/EditSecurityGroupsSection';
import SpotInstancesSection from './sections/SpotInstancesSection';
import { buildMachinePoolRequest, buildNodePoolRequest } from './utils';

const modalDescription =
  'A machine pool is a group of machines that are all clones of the same configuration, that can be used on demand by an application running on a pod.';

const submitEdit = ({
  cluster,
  values,
  currentMPId,
  currentMachinePool,
}: {
  cluster: Cluster;
  values: EditMachinePoolValues;
  currentMPId?: string;
  currentMachinePool: MachinePool | undefined;
}) => {
  const isHypershift = isHypershiftCluster(cluster);
  const isMultiZoneMachinePool = isMPoolAz(cluster, currentMachinePool?.availability_zones?.length);

  const pool = isHypershift
    ? buildNodePoolRequest(values, {
        isEdit: !!currentMPId,
        isMultiZoneMachinePool,
      })
    : buildMachinePoolRequest(values, {
        isEdit: !!currentMPId,
        isMultiZoneMachinePool,
        isROSACluster: isROSA(cluster),
      });

  // Edit request
  if (currentMPId) {
    const request = isHypershift ? clusterService.patchNodePool : clusterService.patchMachinePool;
    return request(cluster.id || '', currentMPId, pool);
  }

  // Creation request
  const request = isHypershift ? clusterService.addNodePool : clusterService.addMachinePool;
  return request(cluster.id || '', pool);
};

type EditMachinePoolModalProps = {
  cluster: Cluster;
  onClose: () => void;
  onSave?: () => void;
  machinePoolId?: string;
  isEdit?: boolean;
  shouldDisplayClusterName?: boolean;
  machinePoolsResponse: PromiseReducerState<{
    data: MachinePool[];
  }>;
  machineTypesResponse: GlobalState['machineTypes'];
  isHypershift?: boolean;
};

const EditMachinePoolModal = ({
  cluster,
  onClose,
  onSave,
  machinePoolId,
  isEdit: isInitEdit,
  machinePoolsResponse,
  machineTypesResponse,
  shouldDisplayClusterName,
  isHypershift,
}: EditMachinePoolModalProps) => {
  const getIsEditValue = React.useCallback(
    () => !!isInitEdit || !!machinePoolId,
    [isInitEdit, machinePoolId],
  );

  const [submitError, setSubmitError] = React.useState<AxiosError<any>>();
  const [currentMachinePool, setCurrentMachinePool] = React.useState<MachinePool>();
  const [isEdit, setIsEdit] = React.useState<boolean>(getIsEditValue());
  const { initialValues, validationSchema } = useMachinePoolFormik({
    machinePool: currentMachinePool,
    cluster,
    machinePools: machinePoolsResponse,
    machineTypes: machineTypesResponse,
  });
  const allow500Nodes = useFeatureGate(MAX_COMPUTE_NODES_500);

  const setCurrentMPId = React.useCallback(
    (id: string) => setCurrentMachinePool(machinePoolsResponse.data?.find((mp) => mp.id === id)),
    [setCurrentMachinePool, machinePoolsResponse.data],
  );

  React.useEffect(() => {
    if (machinePoolsResponse.pending) {
      setCurrentMachinePool(undefined);
    } else if (machinePoolsResponse.data?.length) {
      if (machinePoolId) {
        setCurrentMPId(machinePoolId);
      } else if (isEdit) {
        setCurrentMachinePool(machinePoolsResponse.data[0]);
      }
    }
  }, [
    machinePoolsResponse.pending,
    machinePoolsResponse.data,
    machinePoolId,
    isEdit,
    setCurrentMPId,
  ]);

  React.useEffect(() => {
    setIsEdit(getIsEditValue());
  }, [getIsEditValue]);

  // Checks if max nodes amount is reached for add machine pool nodes
  const isMaxReached =
    isHypershift &&
    machinePoolsResponse.data &&
    getNodeCount(
      machinePoolsResponse?.data,
      isHypershift,
      currentMachinePool?.id,
      currentMachinePool?.instance_type,
    ) === getMaxNodesHCP(cluster.version?.raw_id, allow500Nodes);

  return (
    <Formik<EditMachinePoolValues>
      onSubmit={async (values) => {
        setSubmitError(undefined);
        try {
          await submitEdit({
            cluster,
            values,
            currentMPId: currentMachinePool?.id,
            currentMachinePool,
          });
          onSave?.();
          onClose();
        } catch (err) {
          setSubmitError(err as any);
        }
      }}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnMount
    >
      {({ isValid, submitForm, isSubmitting, values }) => (
        <Modal
          id="edit-mp-modal"
          title={isEdit ? 'Edit machine pool' : 'Add machine pool'}
          secondaryTitle={shouldDisplayClusterName ? cluster.name : undefined}
          onClose={isSubmitting ? undefined : onClose}
          isPending={
            machinePoolsResponse.pending ||
            (!machinePoolsResponse.error && !machinePoolsResponse.fulfilled) ||
            (!machineTypesResponse.error && !machineTypesResponse.fulfilled) ||
            (isEdit &&
              machineTypesResponse.fulfilled &&
              machinePoolsResponse.fulfilled &&
              !currentMachinePool)
          }
          modalSize="large"
          description={!isEdit && modalDescription}
          footer={
            <Stack hasGutter>
              {submitError && (
                <StackItem>
                  <ErrorBox
                    message={isEdit ? 'Error editing machine pool' : 'Error adding machine pool'}
                    response={{
                      errorDetails: submitError.response?.data?.details,
                      errorMessage: getErrorMessage({ payload: submitError }),
                      operationID: submitError.response?.data.operation_id,
                    }}
                  />
                </StackItem>
              )}

              <StackItem>
                {isMaxReached ? (
                  <Tooltip content="Maximum cluster node count limit reached">
                    <Button
                      isAriaDisabled={isMaxReached || !isValid}
                      isDisabled={
                        isSubmitting ||
                        !machinePoolsResponse.fulfilled ||
                        !machineTypesResponse.fulfilled ||
                        isEqual(initialValues, values)
                      }
                      onClick={submitForm}
                      isLoading={isSubmitting}
                      className="pf-v5-u-mr-md"
                      data-testid="submit-btn"
                    >
                      {isEdit ? 'Save' : 'Add machine pool'}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    isAriaDisabled={isMaxReached}
                    isDisabled={
                      !isValid ||
                      isSubmitting ||
                      !machinePoolsResponse.fulfilled ||
                      !machineTypesResponse.fulfilled ||
                      isEqual(initialValues, values)
                    }
                    onClick={submitForm}
                    isLoading={isSubmitting}
                    className="pf-v5-u-mr-md"
                    data-testid="submit-btn"
                  >
                    {isEdit ? 'Save' : 'Add machine pool'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  isDisabled={isSubmitting}
                  onClick={onClose}
                  data-testid="cancel-btn"
                >
                  Cancel
                </Button>
              </StackItem>
            </Stack>
          }
        >
          {machinePoolsResponse.error || machineTypesResponse.error ? (
            <ErrorBox
              message="Failed to fetch resources"
              response={
                machinePoolsResponse.error
                  ? machinePoolsResponse
                  : (machineTypesResponse as ErrorState)
              }
            />
          ) : (
            <Form>
              <EditDetailsSection
                cluster={cluster}
                machinePools={machinePoolsResponse.data || []}
                isEdit={isEdit}
                currentMPId={currentMachinePool?.id}
                setCurrentMPId={setCurrentMPId}
              />
              <EditNodeCountSection
                cluster={cluster}
                machinePool={currentMachinePool}
                machinePools={machinePoolsResponse.data || []}
                machineTypes={machineTypesResponse}
                allow500Nodes={allow500Nodes}
              />
              <DiskSizeField cluster={cluster} isEdit={isEdit} />
              <ExpandableSection toggleText="Edit node labels and taints">
                <EditLabelsSection />
                <EditTaintsSection
                  cluster={cluster}
                  machinePools={machinePoolsResponse.data || []}
                  machinePoolId={currentMachinePool?.id}
                  machineTypes={machineTypesResponse}
                />
              </ExpandableSection>
              <EditSecurityGroupsSection cluster={cluster} isReadOnly={isEdit} />
              {canUseSpotInstances(cluster) && <SpotInstancesSection isEdit={isEdit} />}
            </Form>
          )}
        </Modal>
      )}
    </Formik>
  );
};

type ConnectedEditMachinePoolModalProps = {
  clearMachinePools: boolean;
};

export const ConnectedEditMachinePoolModal = ({
  clearMachinePools,
}: ConnectedEditMachinePoolModalProps) => {
  const data = useGlobalState((state) => state.modal.data);
  const dispatch = useDispatch();

  const onModalClose = () => {
    dispatch(closeModal());
    if (clearMachinePools) {
      clearGetMachinePoolsResponse()(dispatch);
    }
  };
  const { cluster, shouldDisplayClusterName } = data as any;
  const machinePoolsResponse = useMachinePools(cluster);
  const machineTypesResponse = useMachineTypes();

  const isHypershift = isHypershiftCluster(cluster);
  const machinePoolsList = isHypershift
    ? {
        ...machinePoolsResponse,
        data: machinePoolsResponse.data?.map(normalizeNodePool) || [],
      }
    : machinePoolsResponse;

  return cluster ? (
    <EditMachinePoolModal
      isHypershift={isHypershift}
      shouldDisplayClusterName={shouldDisplayClusterName}
      cluster={cluster}
      onClose={onModalClose}
      isEdit
      machineTypesResponse={machineTypesResponse}
      machinePoolsResponse={machinePoolsList}
      onSave={() => {
        if (!machinePoolsResponse.pending) {
          getMachineOrNodePools(cluster.id, isHypershift, cluster.version.raw_id)(dispatch);
        }
      }}
    />
  ) : null;
};

ConnectedEditMachinePoolModal.modalName = modals.EDIT_MACHINE_POOL;

export default EditMachinePoolModal;
