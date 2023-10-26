import { FormGroup, NumberInput } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { MAX_NODES } from '~/components/clusters/common/machinePools/constants';
import { Cluster } from '~/types/clusters_mgmt.v1';
import useFormikOnChange from '../hooks/useFormikOnChange';

type AutoscaleMinReplicasFieldProps = {
  cluster: Cluster;
  minNodes: number;
};

const fieldId = 'autoscaleMin';

const AutoscaleMinReplicasField = ({
  cluster,
  minNodes: initMinNodes,
}: AutoscaleMinReplicasFieldProps) => {
  const [field, { error, touched }] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const isMultiAz = isMultiAZ(cluster);

  const minNodes = isMultiAz ? initMinNodes / 3 : initMinNodes;
  const maxNodes = isMultiAz ? MAX_NODES / 3 : MAX_NODES;

  return (
    <FormGroup
      fieldId={fieldId}
      label="Minimum nodes count"
      isRequired
      helperText={isMultiAz && `x 3 zones = ${field.value * 3}`}
      validated={touched && error ? 'error' : 'default'}
      helperTextInvalid={touched ? error : undefined}
    >
      <NumberInput
        {...field}
        onPlus={() => onChange(field.value + 1)}
        onMinus={() => onChange(field.value - 1)}
        onChange={(e) => {
          const newValue = (e.target as any).value;
          onChange(Number(newValue));
        }}
        id={fieldId}
        min={minNodes}
        max={maxNodes}
      />
    </FormGroup>
  );
};

export default AutoscaleMinReplicasField;
