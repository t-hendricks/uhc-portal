import React from 'react';
import { Field } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import { IMDSType } from '~/components/clusters/wizards/common';
import { imdsOptions } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField/imdsOptions';
import { ImdsSectionHint } from '~/components/clusters/wizards/common/ClusterSettings/MachinePool/ImdsSectionField';

import './ImdsSection.scss';

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
    if (isDisabled && imds !== IMDSType.Optional) {
      // The user can go back and change the cluster version
      onChangeImds(IMDSType.Optional);
    }
  }, [isDisabled]);

  return (
    <FormGroup
      label="Instance Metadata Service"
      fieldId="imds"
      labelIcon={<ImdsSectionHint isImdsDisabled={isDisabled} />}
    >
      <Field
        component={RadioButtons}
        name="imds"
        ariaLabel="Instance Metadata Service"
        props={{
          value: imds,
          onChange: onChangeImds,
        }}
        isDisabled={isDisabled}
        className="imds-section__radio-buttons"
        options={imdsOptions}
        disableDefaultValueHandling
      />
    </FormGroup>
  );
};

export default ImdsSection;
