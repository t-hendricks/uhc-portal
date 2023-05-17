import React from 'react';
import { Field } from 'formik';
import { FormGroup } from '@patternfly/react-core';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import { IMDSType } from '~/components/clusters/wizards/common';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { useFormState } from '../../../../hooks';
import { canSelectImds } from '../../../../rosa/constants';
import { ImdsSectionHint } from './ImdsSectionHint';
import { imdsOptions } from './imdsOptions';

import './ImdsSectionField.scss';

export const ImdsSectionField = () => {
  const {
    values: { [FieldId.ClusterVersion]: clusterVersion, [FieldId.IMDS]: imds },
    getFieldProps,
    setFieldValue,
  } = useFormState();

  const isDisabled = !canSelectImds(clusterVersion.raw_id);

  const onChange = (value: IMDSType) => {
    setFieldValue(FieldId.IMDS, value);
  };

  React.useEffect(() => {
    if (isDisabled && imds !== IMDSType.Optional) {
      // The user can go back and change the cluster version
      onChange(IMDSType.Optional);
    }
  }, [clusterVersion]);

  return (
    <FormGroup
      label="Instance Metadata Service"
      fieldId="imds"
      labelIcon={<ImdsSectionHint isImdsDisabled={isDisabled} />}
    >
      <Field
        component={RadioButtons}
        name="imds"
        id="imds"
        ariaLabel="Instance Metadata Service"
        isDisabled={isDisabled}
        className="imds-section__radio-buttons"
        input={{
          ...getFieldProps(FieldId.IMDS),
          onChange,
        }}
        options={imdsOptions}
        disableDefaultValueHandling // To prevent initial onChange with 'undefined' value
      />
    </FormGroup>
  );
};
