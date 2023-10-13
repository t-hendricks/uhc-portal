import { FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core';
import * as React from 'react';
import { Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import TextField from '~/components/common/formik/TextField';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import SubnetField from '../fields/SubnetField';
import InstanceTypeField from '../fields/InstanceTypeField';

type EditDetailsSectionProps = {
  cluster: Cluster;
  isEdit: boolean;
  machinePools: MachinePool[];
  currentMPId: string | undefined;
  setCurrentMPId: (currentMPId: string) => void;
};

const EditDetailsSection = ({
  cluster,
  isEdit,
  machinePools,
  setCurrentMPId,
  currentMPId,
}: EditDetailsSectionProps) => (
  <>
    {isEdit ? (
      <FormGroup fieldId="machine-pool" label="Machine pool">
        <FormSelect id="machine-pool" onChange={setCurrentMPId} value={currentMPId}>
          {machinePools.map((mp) => (
            <FormSelectOption label={mp.id || ''} key={mp.id} value={mp.id} />
          ))}
        </FormSelect>
      </FormGroup>
    ) : (
      <>
        <TextField fieldId="name" label="Machine pool name" isRequired />
        {isHypershiftCluster(cluster) && <SubnetField />}
        <InstanceTypeField cluster={cluster} />
      </>
    )}
  </>
);

export default EditDetailsSection;
