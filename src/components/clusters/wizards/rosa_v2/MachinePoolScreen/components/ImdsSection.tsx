import React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { Field } from 'formik';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import { IMDSType } from '~/components/clusters/wizards/common';
import {
  ImdsOptionType,
  imdsOptions,
} from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/imdsOptions';
import { ImdsSectionHint } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/ImdsSectionHint';
import { ImdsSectionAlert } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/ImdsSectionAlert';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';

type ImdsSectionProps = {
  isDisabled: boolean;
  onChangeImds: (value: IMDSType) => void;
  imds: IMDSType;
};

const ImdsSection = ({ isDisabled, onChangeImds, imds }: ImdsSectionProps) => {
  const { setFieldValue, getFieldProps, getFieldMeta } = useFormState();

  React.useEffect(() => {
    if (isDisabled && imds !== IMDSType.V1AndV2) {
      // The user can go back and change the cluster version
      onChangeImds(IMDSType.V1AndV2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, imds]);

  return (
    <FormGroup label="Instance Metadata Service" fieldId="imds" labelIcon={<ImdsSectionHint />}>
      {isDisabled ? (
        <ImdsSectionAlert />
      ) : (
        <Field
          component={RadioButtons}
          name={FieldId.Imds}
          ariaLabel="Instance Metadata Service"
          props={{
            value: imds,
            onChange: onChangeImds,
          }}
          isDisabled={isDisabled}
          className="pf-v5-u-mb-md"
          options={imdsOptions}
          disableDefaultValueHandling
          input={{
            ...getFieldProps(FieldId.Imds),
            onChange: (value: ImdsOptionType) => setFieldValue(FieldId.Imds, value, false),
          }}
          meta={getFieldMeta(FieldId.Imds)}
        />
      )}
    </FormGroup>
  );
};

export default ImdsSection;
