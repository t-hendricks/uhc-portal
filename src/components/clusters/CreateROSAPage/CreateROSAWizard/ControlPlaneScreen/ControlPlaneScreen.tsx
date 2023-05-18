import React from 'react';

import { Form, Title, Text, TextVariants, Grid, GridItem } from '@patternfly/react-core';

import { Field, ChangeAction } from 'redux-form';
import { FormikValues } from 'formik';
import { Link } from 'react-router-dom';
import { hypershiftValue } from './ControlPlaneCommon';
import HostedTile from './HostedTile';
import StandAloneTile from './StandAloneTile';
import links from '~/common/installLinks.mjs';
import './controlPlaneScreen.scss';
import ExternalLink from '~/components/common/ExternalLink';

import AWSLogo from '~/styles/images/AWS.png';
import RedHat from '~/styles/images/Logo-Red_Hat-B-Standard-RGB.png';

import { productName } from '../CreateRosaGetStarted/CreateRosaGetStarted';

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

    if (isHypershift === 'true' && formValues.multi_az === 'true') {
      change('multi_az', 'false');
    }

    // Reset the cluster privacy public subnet ID when Standalone is chosen.
    if (isHypershift === 'false' && formValues.cluster_privacy_public_subnet_id) {
      change('cluster_privacy_public_subnet_id', undefined);
    }
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
    {/* these images use fixed positioning */}
    <div className="ocm-c-wizard-intro-image-container">
      <img src={RedHat} className="ocm-c-wizard-intro-image-top" aria-hidden="true" alt="" />
      <img src={AWSLogo} className="ocm-c-wizard-intro-image-bottom" aria-hidden="true" alt="" />
    </div>
    <Grid hasGutter className="pf-u-mt-md">
      <GridItem span={10}>
        <Title headingLevel="h2">Welcome to Red Hat OpenShift Service on AWS (ROSA)</Title>
        <Text component={TextVariants.p} className="pf-u-mt-md pf-u-mb-sm">
          Create a managed OpenShift cluster on an existing Amazon Web Services (AWS) account.
        </Text>
      </GridItem>
      <GridItem span={10}>
        <Title headingLevel="h3" className="pf-u-mb-sm">
          Prerequisites
        </Title>
        <Text component={TextVariants.p}>
          To use the web interface to create a ROSA cluster you will need to have already completed
          the prerequisite steps to prepare your AWS account on the{' '}
          <Link to="getstarted">{`Get started with ${productName} (ROSA) page.`}</Link>
        </Text>
      </GridItem>
      <GridItem span={10}>
        <Title headingLevel="h3" className="pf-u-mb-sm">
          Select an AWS control plane type
        </Title>
        <Text component={TextVariants.p}>
          Not sure what to choose?{' '}
          <ExternalLink href={links.AWS_CONTROL_PLANE_URL}>
            Learn more about AWS control plane types
          </ExternalLink>
        </Text>
      </GridItem>
    </Grid>
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
