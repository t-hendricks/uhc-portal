import React from 'react';
import { Field } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import { IMDSType } from '~/components/clusters/wizards/common';
import { imdsOptions } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/imdsOptions';
import { ImdsSectionHint } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField';
import { ImdsSectionAlert } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/ImdsSectionAlert';

const ImdsSection = ({
  isDisabled,
  onChangeImds,
  imds,
}: {
  isDisabled: boolean;
  onChangeImds: (value: IMDSType) => void;
  imds: IMDSType;
}) => {
  React.useEffect(() => {
    if (isDisabled && imds !== IMDSType.V1AndV2) {
      // The user can go back and change the cluster version
      onChangeImds(IMDSType.V1AndV2);
    }
  }, [isDisabled, imds]);

  return (
    <FormGroup label="Instance Metadata Service" fieldId="imds" labelIcon={<ImdsSectionHint />}>
      {isDisabled && <ImdsSectionAlert />}
      <Field
        component={RadioButtons}
        name="imds"
        ariaLabel="Instance Metadata Service"
        props={{
          value: imds,
          onChange: onChangeImds,
        }}
        isDisabled={isDisabled}
        className="pf-u-mb-sm"
        options={imdsOptions}
        disableDefaultValueHandling
      />
    </FormGroup>
  );
};

export default ImdsSection;
