import React from 'react';

import { Form, Title, Text, TextVariants } from '@patternfly/react-core';

import { Field, ChangeAction } from 'redux-form';
import { FormikValues } from 'formik';
import { hypershiftValue } from './ControlPlaneCommon';
import HostedTile from './HostedTile';
import StandAloneTile from './StandAloneTile';
import links from '~/common/installLinks.mjs';
import './controlPlaneScreen.scss';
import ExternalLink from '~/components/common/ExternalLink';

type ControlPlaneFieldProps = {
  input: {
    value: hypershiftValue;
    onChange: (value: hypershiftValue) => void;
  };
  change: ChangeAction;
  formValues: FormikValues;
};

const ControlPlaneField = ({
  input: { value, onChange },
  change,
  formValues,
}: ControlPlaneFieldProps) => {
  React.useEffect(() => {
    if (!value) {
      onChange('true');
    }
  }, []);

  const handleChange = (isHypershift: hypershiftValue) => {
    onChange(isHypershift);
    // Uncheck the following Network checkboxes when switching Control plane selection
    change('install_to_vpc', false);
    change('configure_proxy', false);
    // Reset VPC settings in case they were configured and then came back to the Control plane step
    Object.keys(formValues).forEach((formValue) => {
      if (
        formValue.startsWith('public_subnet_id_') ||
        formValue.startsWith('private_subnet_id_') ||
        formValue.startsWith('az_')
      ) {
        change(formValue, '');
      }
    });
  };

  return (
    <>
      <HostedTile handleChange={handleChange} isSelected={value === 'true'} />
      <StandAloneTile handleChange={handleChange} isSelected={value === 'false'} />
    </>
  );
};

const ControlPlaneScreen = ({
  change,
  formValues,
}: {
  change: ChangeAction;
  formValues: FormikValues;
}) => (
  <Form
    onSubmit={(event) => {
      event.preventDefault();
      return false;
    }}
  >
    <Title headingLevel="h3">Select an AWS control plane type</Title>
    <Text component={TextVariants.p}>
      Not sure what to choose?{' '}
      <ExternalLink href={links.AWS_CONTROL_PLANE_URL}>
        Learn more about AWS control plane types
      </ExternalLink>
    </Text>
    <Field
      name="hypershift"
      component={ControlPlaneField}
      validate={(value: hypershiftValue | undefined) =>
        !value ? 'Control plane is required.' : undefined
      }
      change={change}
      formValues={formValues}
    />
  </Form>
);

export default ControlPlaneScreen;
