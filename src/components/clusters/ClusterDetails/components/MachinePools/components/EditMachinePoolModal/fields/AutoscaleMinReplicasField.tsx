import * as React from 'react';
import { useField } from 'formik';

import { FormGroup, NumberInput } from '@patternfly/react-core';

import {
  isHypershiftCluster,
  isMPoolAz,
} from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import { MAX_NODES, MAX_NODES_HCP } from '~/components/clusters/common/machinePools/constants';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import useFormikOnChange from '~/hooks/useFormikOnChange';
import { Cluster } from '~/types/clusters_mgmt.v1';

type AutoscaleMinReplicasFieldProps = {
  cluster: Cluster;
  minNodes: number;
  mpAvailZones?: number;
};

const fieldId = 'autoscaleMin';

const AutoscaleMinReplicasField = ({
  cluster,
  minNodes: initMinNodes,
  mpAvailZones,
}: AutoscaleMinReplicasFieldProps) => {
  const [field, { error, touched }] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);
  const isMultizoneMachinePool = isMPoolAz(cluster, mpAvailZones);
  const defaultMaxNodes = isHypershiftCluster(cluster) ? MAX_NODES_HCP : MAX_NODES;

  const minNodes = isMultizoneMachinePool ? initMinNodes / 3 : initMinNodes;
  const maxNodes = isMultizoneMachinePool ? defaultMaxNodes / 3 : defaultMaxNodes;

  return (
    <FormGroup fieldId={fieldId} label="Minimum nodes count" isRequired>
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

      <FormGroupHelperText touched={touched} error={error}>
        {isMultizoneMachinePool && `x 3 zones = ${field.value * 3}`}
      </FormGroupHelperText>
    </FormGroup>
  );
};

export default AutoscaleMinReplicasField;
