import { FormGroup, NumberInput } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import {
  getWorkerNodeVolumeSizeMaxGiB,
  workerNodeVolumeSizeMinGiB,
} from '~/components/clusters/wizards/rosa/constants';
import PopoverHint from '~/components/common/PopoverHint';
import { Cluster } from '~/types/clusters_mgmt.v1';

import WithTooltip from '~/components/common/WithTooltip';
import { normalizeProductID } from '~/common/normalize';
import { normalizedProducts } from '~/common/subscriptionTypes';
import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import useFormikOnChange from '../hooks/useFormikOnChange';

import './DiskSizeField.scss';

const fieldId = 'diskSize';

type DiskSizeFieldProps = {
  cluster: Cluster;
  isEdit: boolean;
};

const DiskSizeField = ({ cluster, isEdit }: DiskSizeFieldProps) => {
  const showDiskSize =
    normalizeProductID(cluster.product?.id) === normalizedProducts.ROSA &&
    !isHypershiftCluster(cluster);
  const [field, { error, touched }] = useField<number>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const maxWorkerVolumeSizeGiB = getWorkerNodeVolumeSizeMaxGiB(cluster.version?.raw_id || '');

  return showDiskSize ? (
    <FormGroup
      fieldId={fieldId}
      label="Root disk size"
      isRequired
      validated={touched && error ? 'error' : 'default'}
      helperTextInvalid={touched ? error : undefined}
      labelIcon={
        <PopoverHint
          hint={`Root disks are AWS EBS volumes attached as the primary disk for AWS EC2 instances. The root disk size for this machine pool group of nodes must be between ${workerNodeVolumeSizeMinGiB}GiB and ${maxWorkerVolumeSizeGiB}GiB.`}
        />
      }
    >
      <WithTooltip
        showTooltip={isEdit}
        content="This option cannot be edited from its original setting selection."
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
          min={workerNodeVolumeSizeMinGiB}
          max={maxWorkerVolumeSizeGiB}
          unit={<span className="ocm-disk-size_unit">GiB</span>}
          isDisabled={isEdit}
        />
      </WithTooltip>
    </FormGroup>
  ) : null;
};

export default DiskSizeField;
