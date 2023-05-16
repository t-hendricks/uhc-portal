import React from 'react';
import { Field } from 'redux-form';
import { FormGroup, Text, TextVariants } from '@patternfly/react-core';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import { IMDSType } from '~/components/clusters/wizards/common';
import PopoverHint from '~/components/common/PopoverHint';

import './ImdsSection.scss';

const ImdsSection = ({
  isDisabled,
  onChangeImds,
  imds,
}: {
  isDisabled: boolean;
  onChangeImds: (value: IMDSType) => void;
  imds: IMDSType;
}) => (
  <FormGroup
    label="Instance Metadata Service"
    fieldId="imds"
    labelIcon={
      <PopoverHint
        minWidth="30rem"
        title="Amazon EC2 Instance Metadata Service (IMDS)"
        bodyContent={
          <>
            <Text component={TextVariants.p}>
              Instance metadata is data that is related to an Amazon Elastic Compute Cloud (Amazon
              EC2) instance that applications can use to configure or manage the running instance.
            </Text>
            {isDisabled && (
              <Text component={TextVariants.p}>
                <b>In order to enable Instance Metadata Service options</b>, in the previous step
                you must select a cluster version greater or equal to 4.11.
              </Text>
            )}
          </>
        }
      />
    }
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
      options={[
        {
          value: IMDSType.Optional,
          ariaLabel: 'Both IMDSv1 and IMDSv2',
          label: (
            <>
              Use both IMDSv1 and IMDSv2
              <div className="ocm-c--reduxradiobutton-description">
                Allows use of both IMDS versions for backward compatibility
              </div>
            </>
          ),
        },
        {
          value: IMDSType.Required,
          ariaLabel: 'IMDSv2 only',
          label: (
            <>
              Use IMDSv2 only
              <div className="ocm-c--reduxradiobutton-description">
                A session-oriented method with enhanced security
              </div>
            </>
          ),
        },
      ]}
      disableDefaultValueHandling
    />
  </FormGroup>
);

export default ImdsSection;
