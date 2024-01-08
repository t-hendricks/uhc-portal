import { FormGroup, NumberInput } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import links from '~/common/installLinks.mjs';
import { normalizeProductID } from '~/common/normalize';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import { Cluster } from '~/types/clusters_mgmt.v1';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { computeNodeHintText } from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleHelper';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import useFormikOnChange from '../hooks/useFormikOnChange';

type AutoscaleMaxReplicasFieldProps = {
  minNodes: number;
  cluster: Cluster;
  options: number[];
};

const fieldId = 'autoscaleMax';

const AutoscaleMaxReplicasField = ({
  minNodes: initMinNodes,
  cluster,
  options,
}: AutoscaleMaxReplicasFieldProps) => {
  const [field, { error, touched }] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const isMultiAz = isMultiAZ(cluster);
  const isRosa = normalizeProductID(cluster.product?.id) === normalizedProducts.ROSA;

  const maxValue = options.length ? options[options.length - 1] : 0;

  const minNodes = isMultiAz ? initMinNodes / 3 : initMinNodes;
  const maxNodes = isMultiAz ? maxValue / 3 : maxValue;

  return (
    <FormGroup
      fieldId={fieldId}
      label="Maximum nodes count"
      isRequired
      labelIcon={
        <PopoverHint
          buttonAriaLabel="Compute node count information"
          hint={
            <>
              {computeNodeHintText(false, isHypershiftCluster(cluster))}
              {isRosa && (
                <>
                  <br />
                  <ExternalLink href={links.ROSA_WORKER_NODE_COUNT}>
                    Learn more about worker/compute node count
                  </ExternalLink>
                </>
              )}
            </>
          }
        />
      }
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
        min={minNodes || 1}
        max={maxNodes}
      />

      <FormGroupHelperText touched={touched} error={error}>
        {isMultiAz && `x 3 zones = ${field.value * 3}`}
      </FormGroupHelperText>
    </FormGroup>
  );
};

export default AutoscaleMaxReplicasField;
