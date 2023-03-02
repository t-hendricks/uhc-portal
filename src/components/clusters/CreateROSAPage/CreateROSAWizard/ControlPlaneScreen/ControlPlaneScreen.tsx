import React from 'react';

import { Form, Title, Text, TextVariants } from '@patternfly/react-core';

import { Field } from 'redux-form';
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
};

const ControlPlaneField = ({ input: { value, onChange } }: ControlPlaneFieldProps) => {
  React.useEffect(() => {
    if (!value) {
      onChange('true');
    }
  }, []);

  const handleChange = (isHypershift: hypershiftValue) => {
    onChange(isHypershift);
  };

  return (
    <>
      <HostedTile handleChange={handleChange} isSelected={value === 'true'} />
      <StandAloneTile handleChange={handleChange} isSelected={value === 'false'} />
    </>
  );
};

const ControlPlaneScreen = () => (
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
    />
  </Form>
);

export default ControlPlaneScreen;
