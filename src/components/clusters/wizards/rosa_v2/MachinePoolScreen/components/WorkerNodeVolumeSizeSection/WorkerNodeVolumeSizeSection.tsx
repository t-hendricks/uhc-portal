import React, { useEffect } from 'react';
import { Field } from 'formik';

import { FormGroup } from '@patternfly/react-core';

import { validateWorkerVolumeSize } from '~/common/validators';
import { useFormState } from '~/components/clusters/wizards/hooks';
import {
  defaultWorkerNodeVolumeSizeGiB,
  workerNodeVolumeSizeMinGiB,
} from '~/components/clusters/wizards/rosa/constants';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import FormNumberInput from '~/components/common/FormComponents/FormNumberInput';
import PopoverHint from '~/components/common/PopoverHint';

import './WorkerNodeVolumeSizeSection.scss';

type WorkerNodeVolumeSizeSectionProps = {
  maxWorkerVolumeSizeGiB: number;
};

const WorkerNodeVolumeSizeSection = ({
  maxWorkerVolumeSizeGiB,
}: WorkerNodeVolumeSizeSectionProps) => {
  const {
    values: { [FieldId.WorkerVolumeSizeGib]: workerVolumeSizeGib },
    setFieldValue,
    setFieldTouched,
    getFieldProps,
    getFieldMeta,
  } = useFormState();

  useEffect(() => {
    if (workerVolumeSizeGib === undefined) {
      setFieldValue(FieldId.WorkerVolumeSizeGib, defaultWorkerNodeVolumeSizeGiB, true);
    }
  }, [setFieldValue, workerVolumeSizeGib]);

  return (
    <FormGroup
      className="worker-node-volume-size-section"
      label="Root disk size"
      isRequired
      fieldId={FieldId.WorkerVolumeSizeGib}
      labelIcon={
        <PopoverHint
          hint={`Root disks are AWS EBS volumes attached as the primary disk for AWS EC2 instances. The root disk size for this machine pool group of nodes must be between ${workerNodeVolumeSizeMinGiB}GiB and ${maxWorkerVolumeSizeGiB}GiB.`}
        />
      }
    >
      <Field
        component={FormNumberInput}
        name={FieldId.WorkerVolumeSizeGib}
        inputName={FieldId.WorkerVolumeSizeGib}
        inputAriaLabel="Worker root disk size"
        validate={(value: number) =>
          validateWorkerVolumeSize(value, {}, { maxWorkerVolumeSizeGiB })
        }
        min={workerNodeVolumeSizeMinGiB}
        max={maxWorkerVolumeSizeGiB}
        widthChars={5}
        unit="GiB"
        input={{
          ...getFieldProps(FieldId.WorkerVolumeSizeGib),
          value: workerVolumeSizeGib,
          onChange: (value: string) => {
            setFieldValue(FieldId.WorkerVolumeSizeGib, parseFloat(value), true);
            setTimeout(() => setFieldTouched(FieldId.WorkerVolumeSizeGib, false), 1);
          },
        }}
        meta={getFieldMeta(FieldId.WorkerVolumeSizeGib)}
      />
    </FormGroup>
  );
};

export default WorkerNodeVolumeSizeSection;
