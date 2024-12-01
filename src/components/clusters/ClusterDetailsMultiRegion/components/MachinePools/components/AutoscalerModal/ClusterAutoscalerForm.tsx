import React from 'react';
import { Formik } from 'formik';

import {
  getClusterAutoScalingSubmitSettings,
  getDefaultClusterAutoScaling,
} from '~/components/clusters/common/clusterAutoScalingValues';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import modals from '~/components/common/Modal/modals';
import { useUpdateClusterAutoscaler } from '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useUpdateClusterAutoscaler';
import { ClusterAutoscalerResponseType } from '~/queries/types';
import { useGlobalState } from '~/redux/hooks';

import { ClusterAutoscalerModal } from './ClusterAutoscalerModal';

type ClusterAutoscalerFormProps = {
  hasClusterAutoscaler: boolean;
  clusterId: string;
  isWizard: boolean;
  hasAutoscalingMachinePools: boolean;
  region?: string;
  clusterAutoscalerData: ClusterAutoscalerResponseType;
  isClusterAutoscalerRefetching: boolean;
  maxNodesTotalDefault: number;
};

export const ClusterAutoscalerForm = ({
  hasClusterAutoscaler,
  clusterId,
  isWizard,
  hasAutoscalingMachinePools,
  region,
  clusterAutoscalerData,
  isClusterAutoscalerRefetching,
  maxNodesTotalDefault,
}: ClusterAutoscalerFormProps) => {
  const isOpen = useGlobalState(
    (state) => state.modal.modalName === modals.EDIT_CLUSTER_AUTOSCALING_V2,
  );
  const { mutate: mutateUpdateClusterAutoscaler, isPending: isUpdateClusterAutoscalerPending } =
    useUpdateClusterAutoscaler(clusterId, region);

  return (
    <Formik
      enableReinitialize
      validateOnMount
      initialValues={{
        [FieldId.ClusterAutoscaling]: !hasClusterAutoscaler
          ? getDefaultClusterAutoScaling(maxNodesTotalDefault)
          : clusterAutoscalerData.data,
      }}
      validate={() => {}}
      onSubmit={(values: any) => {
        mutateUpdateClusterAutoscaler(
          getClusterAutoScalingSubmitSettings(values.cluster_autoscaling),
        );
      }}
    >
      {({ dirty, submitForm }) => (
        <ClusterAutoscalerModal
          submitForm={submitForm}
          isUpdateClusterAutoscalerPending={isUpdateClusterAutoscalerPending}
          clusterId={clusterId}
          hasClusterAutoscaler={hasClusterAutoscaler}
          isRosa
          isOpen={isOpen}
          isWizard={isWizard}
          dirty={dirty}
          hasAutoscalingMachinePools={hasAutoscalingMachinePools}
          isClusterAutoscalerRefetching={isClusterAutoscalerRefetching}
          maxNodesTotalDefault={maxNodesTotalDefault}
        />
      )}
    </Formik>
  );
};
