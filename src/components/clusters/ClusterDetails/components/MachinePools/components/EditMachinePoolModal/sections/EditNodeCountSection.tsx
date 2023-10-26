import { Grid, GridItem, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { useFormikContext } from 'formik';
import { GlobalState } from '~/redux/store';
import { Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import { useGlobalState } from '~/redux/hooks';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { getNodeOptions } from '~/components/clusters/common/machinePools/utils';
import AutoscalingField from '../fields/AutoscalingField';
import NodeCountField from '../fields/NodeCountField';
import { getClusterMinNodes } from '../../../machinePoolsHelper';
import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';
import ResizingAlert from '../components/ResizingAlert';
import MachinePoolsAutoScalingWarning from '../../../MachinePoolAutoscalingWarning';
import AutoscaleMinReplicasField from '../fields/AutoscaleMinReplicasField';
import AutoscaleMaxReplicasField from '../fields/AutoscaleMaxReplicasField';

type EditNodeCountSectionProps = {
  machinePool: MachinePool | undefined;
  machinePools: MachinePool[];
  cluster: Cluster;
  machineTypes: GlobalState['machineTypes'];
};

const EditNodeCountSection = ({
  machinePool,
  machinePools,
  cluster,
  machineTypes,
}: EditNodeCountSectionProps) => {
  const { values } = useFormikContext<EditMachinePoolValues>();

  const hasClusterAutoScaler = useGlobalState((state) => state.clusterAutoscaler.hasAutoscaler);
  const organization = useGlobalState((state) => state.userProfile.organization);

  const minNodesRequired = getClusterMinNodes({
    cluster,
    machineTypesResponse: machineTypes,
    machinePool,
    machinePools,
  });

  const options = React.useMemo(
    () =>
      getNodeOptions({
        cluster,
        machinePools,
        machineTypeId: values.instanceType,
        machineTypes,
        quota: organization.quotaList,
        minNodes: minNodesRequired,
      }),
    [
      cluster,
      machinePools,
      values.instanceType,
      machineTypes,
      organization.quotaList,
      minNodesRequired,
    ],
  );

  return (
    <>
      <AutoscalingField cluster={cluster} />
      {organization.pending ? (
        <div>
          <Spinner size="md" />
          &nbsp;Loading quota...
        </div>
      ) : (
        <>
          {values.autoscaling ? (
            <Grid hasGutter>
              <GridItem span={5}>
                <AutoscaleMinReplicasField minNodes={minNodesRequired} cluster={cluster} />
              </GridItem>
              <GridItem span={5}>
                <AutoscaleMaxReplicasField
                  minNodes={minNodesRequired}
                  cluster={cluster}
                  options={options}
                />
              </GridItem>
            </Grid>
          ) : (
            <NodeCountField
              minNodesRequired={minNodesRequired}
              cluster={cluster}
              options={options}
            />
          )}
          {!isHypershiftCluster(cluster) && (
            <MachinePoolsAutoScalingWarning
              hasClusterAutoScaler={hasClusterAutoScaler}
              hasAutoscalingMachinePools={machinePools.some((mp) => !!mp.autoscaling)}
              isEnabledOnCurrentPool={values.autoscaling}
              warningType={machinePool ? 'editMachinePool' : 'addMachinePool'}
            />
          )}
          {machinePool?.id && (
            <ResizingAlert
              autoscalingEnabled={values.autoscaling}
              autoScaleMaxNodesValue={values.autoscaleMax}
              cluster={cluster}
              machinePools={machinePools}
              selectedMachinePoolID={machinePool.id}
              replicasValue={values.replicas}
            />
          )}
        </>
      )}
    </>
  );
};

export default EditNodeCountSection;
