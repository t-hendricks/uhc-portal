import * as React from 'react';
import { AxiosError } from 'axios';
import { Button, ExpandableSection, Form, Stack, StackItem } from '@patternfly/react-core';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import Modal from '~/components/common/Modal/Modal';
import { clusterService } from '~/services';
import {
  isHypershiftCluster,
  isMultiAZ,
} from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import ErrorBox from '~/components/common/ErrorBox';
import { getErrorMessage } from '~/common/errors';
import { AWSSpotMarketOptions, Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import { GlobalState } from '~/redux/store';
import { ErrorState } from '~/types/types';
import modals from '~/components/common/Modal/modals';
import { useGlobalState } from '~/redux/hooks';
import { closeModal } from '~/components/common/Modal/ModalActions';
import { isROSA } from '~/components/clusters/common/clusterStates';
import { PromiseReducerState } from '~/redux/types';

import EditNodeCountSection from './sections/EditNodeCountSection';
import { canUseSpotInstances, normalizeNodePool } from '../../machinePoolsHelper';
import SpotInstancesSection from './sections/SpotInstancesSection';
import useMachinePoolFormik, { EditMachinePoolValues } from './hooks/useMachinePoolFormik';
import DiskSizeField from './fields/DiskSizeField';
import EditLabelsSection from './sections/EditLabelsSection';
import EditTaintsSection from './sections/EditTaintsSection';
import EditDetailsSection from './sections/EditDetailsSection';
import { getBaseMachineOrNodePool } from './utils';
import useMachinePools from './hooks/useMachinePools';
import useMachineTypes from './hooks/useMachineTypes';
import { getMachineOrNodePools } from '../../MachinePoolsActions';

const modalDescription =
  'A machine pool is a group of machines that are all clones of the same configuration, that can be used on demand by an application running on a pod.';

const submitEdit = ({
  cluster,
  values,
  currentMPId,
}: {
  cluster: Cluster;
  values: EditMachinePoolValues;
  currentMPId?: string;
}) => {
  const isHypershift = isHypershiftCluster(cluster);
  const isMultiAz = isMultiAZ(cluster);
  const pool = getBaseMachineOrNodePool(values, isHypershift, isMultiAz);
  if (currentMPId) {
    const request = isHypershift ? clusterService.patchNodePool : clusterService.patchMachinePool;
    return request(cluster.id || '', currentMPId, pool);
  }
  if (isHypershift) {
    return clusterService.addNodePool(cluster.id || '', {
      ...pool,
      aws_node_pool: {
        instance_type: values.instanceType,
      },
      subnet: values.subnet?.subnet_id,
    });
  }

  if (values.useSpotInstances) {
    const options: AWSSpotMarketOptions = {};
    if (values.spotInstanceType === 'maximum') {
      options.max_price = values.maxPrice;
    }
    (pool as MachinePool).aws = {
      spot_market_options: options,
    };
  }

  if (isROSA(cluster)) {
    (pool as MachinePool).root_volume = {
      aws: {
        size: values.diskSize,
      },
    };
  }
  return clusterService.addMachinePool(cluster.id || '', {
    ...pool,
    instance_type: values.instanceType,
  });
};

type EditMachinePoolModalProps = {
  cluster: Cluster;
  onClose: () => void;
  onSave?: () => void;
  machinePoolId?: string;
  isEdit?: boolean;
  machinePoolsResponse: PromiseReducerState<{
    data: MachinePool[];
  }>;
  machineTypesResponse: GlobalState['machineTypes'];
};

const EditMachinePoolModal = ({
  cluster,
  onClose,
  onSave,
  machinePoolId,
  isEdit: isInitEdit,
  machinePoolsResponse,
  machineTypesResponse,
}: EditMachinePoolModalProps) => {
  const [submitError, setSubmitError] = React.useState<AxiosError<any>>();
  const isEdit = !!isInitEdit || !!machinePoolId;
  const [currentMPId, setCurrentMPId] = React.useState<string | undefined>(machinePoolId);

  const currentMachinePool = machinePoolsResponse.data?.find((mp) => mp.id === currentMPId);

  const { initialValues, validationSchema } = useMachinePoolFormik({
    machinePool: currentMachinePool,
    cluster,
    machinePools: machinePoolsResponse,
    machineTypes: machineTypesResponse,
  });

  const firstMachinePoolId = machinePoolsResponse.data?.[0]?.id;

  React.useEffect(() => {
    if (!currentMPId && isEdit && firstMachinePoolId) {
      setCurrentMPId(firstMachinePoolId);
    }
  }, [isEdit, currentMPId, firstMachinePoolId]);

  return (
    <Formik<EditMachinePoolValues>
      onSubmit={async (values) => {
        setSubmitError(undefined);
        try {
          await submitEdit({
            cluster,
            values,
            currentMPId,
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
      {}
      {({ isValid, submitForm, isSubmitting, values }) => (
        <Modal
          id="edit-mp-modal"
          title={isEdit ? 'Edit machine pool' : 'Add machine pool'}
          onClose={isSubmitting ? undefined : onClose}
          isPending={
            (!machinePoolsResponse.error && !machinePoolsResponse.fulfilled) ||
            (!machineTypesResponse.error && !machineTypesResponse.fulfilled)
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
                <Button
                  isDisabled={
                    !isValid ||
                    isSubmitting ||
                    !machinePoolsResponse.fulfilled ||
                    !machineTypesResponse.fulfilled ||
                    isEqual(initialValues, values)
                  }
                  onClick={submitForm}
                  isLoading={isSubmitting}
                  className="pf-u-mr-md"
                  data-testId="submit-btn"
                >
                  {isEdit ? 'Save' : 'Add machine pool'}
                </Button>
                <Button
                  variant="secondary"
                  isDisabled={isSubmitting}
                  onClick={onClose}
                  data-testId="cancel-btn"
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
                currentMPId={currentMPId}
                setCurrentMPId={setCurrentMPId}
              />
              <EditNodeCountSection
                cluster={cluster}
                machinePool={currentMachinePool}
                machinePools={machinePoolsResponse.data || []}
                machineTypes={machineTypesResponse}
              />
              <DiskSizeField cluster={cluster} isEdit={isEdit} />
              <ExpandableSection toggleText="Edit node labels and taints">
                <Form>
                  <EditLabelsSection />
                  <EditTaintsSection
                    cluster={cluster}
                    machinePools={machinePoolsResponse.data || []}
                    machinePoolId={currentMPId}
                    machineTypes={machineTypesResponse}
                  />
                </Form>
              </ExpandableSection>
              {canUseSpotInstances(cluster) && <SpotInstancesSection isEdit={isEdit} />}
            </Form>
          )}
        </Modal>
      )}
    </Formik>
  );
};

export const ConnectedEditMachinePoolModal = () => {
  const data = useGlobalState((state) => state.modal.data);
  const dispatch = useDispatch();
  const onModalClose = () => {
    dispatch(closeModal());
  };
  const { cluster } = data as any;
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
      cluster={cluster}
      onClose={onModalClose}
      isEdit
      machineTypesResponse={machineTypesResponse}
      machinePoolsResponse={machinePoolsList}
      onSave={() => {
        if (!machinePoolsResponse.pending) {
          getMachineOrNodePools(cluster.id, isHypershift)(dispatch);
        }
      }}
    />
  ) : null;
};

ConnectedEditMachinePoolModal.modalName = modals.EDIT_MACHINE_POOL;

export default EditMachinePoolModal;
