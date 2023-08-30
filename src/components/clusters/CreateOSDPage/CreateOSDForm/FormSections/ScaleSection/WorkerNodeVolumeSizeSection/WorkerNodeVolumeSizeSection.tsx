import React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { Field } from 'redux-form';

import { workerNodeVolumeSizeMinGiB } from '~/components/clusters/wizards/rosa/constants';
import ReduxFormNumberInput from '~/components/common/ReduxFormComponents/ReduxFormNumberInput';
import { validateWorkerVolumeSize } from '~/common/validators';
import PopoverHint from '~/components/common/PopoverHint';

import './WorkerNodeVolumeSizeSection.scss';

const WorkerNodeVolumeSizeSection = ({
  maxWorkerVolumeSizeGiB,
}: {
  maxWorkerVolumeSizeGiB: number;
}) => (
  <FormGroup
    className="worker-node-volume-size-section"
    label="Root disk size"
    isRequired
    fieldId="worker_volume_size_gib"
    labelIcon={
      <PopoverHint
        hint={`Root disks are AWS EBS volumes attached as the primary disk for AWS EC2 instances. The root disk size for this machine pool group of nodes must be between ${workerNodeVolumeSizeMinGiB}GiB and ${maxWorkerVolumeSizeGiB}GiB.`}
      />
    }
  >
    <Field
      component={ReduxFormNumberInput}
      name="worker_volume_size_gib"
      inputName="worker_volume_size_gib"
      inputAriaLabel="Worker root disk size"
      parse={(value: string) => parseFloat(value)}
      validate={validateWorkerVolumeSize}
      min={workerNodeVolumeSizeMinGiB}
      max={maxWorkerVolumeSizeGiB}
      widthChars={5}
      unit="GiB"
    />
  </FormGroup>
);

export default WorkerNodeVolumeSizeSection;
