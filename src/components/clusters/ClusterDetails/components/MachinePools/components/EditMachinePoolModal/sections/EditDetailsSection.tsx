import * as React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { SelectOption as SelectOptionDeprecated } from '@patternfly/react-core/deprecated';

import { Cluster, MachinePool } from '~/types/clusters_mgmt.v1';
import TextField from '~/components/common/formik/TextField';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import SubnetField from '../fields/SubnetField';
import InstanceTypeField from '../fields/InstanceTypeField';
import SelectField from '../fields/SelectField';

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
}: EditDetailsSectionProps) =>
  isEdit ? (
    <FormGroup fieldId="machine-pool" label="Machine pool">
      <SelectField fieldId="machine-pool" onSelect={setCurrentMPId} value={currentMPId}>
        {machinePools.map((mp) => (
          <SelectOptionDeprecated key={mp.id} value={mp.id}>
            {mp.id || ''}
          </SelectOptionDeprecated>
        ))}
      </SelectField>
    </FormGroup>
  ) : (
    <>
      <TextField fieldId="name" label="Machine pool name" isRequired />
      {isHypershiftCluster(cluster) && <SubnetField cluster={cluster} />}
      <InstanceTypeField cluster={cluster} />
    </>
  );

export default EditDetailsSection;
