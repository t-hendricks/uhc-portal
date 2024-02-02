import React from 'react';

import { Form, Title, Text, TextVariants, Grid, GridItem } from '@patternfly/react-core';

import { Field, ChangeAction } from 'redux-form';
import { FormikValues } from 'formik';
import links from '~/common/installLinks.mjs';
import './controlPlaneScreen.scss';
import ExternalLink from '~/components/common/ExternalLink';

import AWSLogo from '~/styles/images/AWS.png';
import RedHat from '~/styles/images/Logo-Red_Hat-B-Standard-RGB.png';
import { ApplicationIngressType } from '~/components/clusters/wizards/osd/Networking/constants';
import { PrerequisitesInfoBox } from '~/components/clusters/wizards/rosa_v2/common/PrerequisitesInfoBox';
import { WelcomeMessage } from '~/components/clusters/wizards/rosa_v2/common/WelcomeMessage';
import StandAloneTile from './StandAloneTile';
import HostedTile from './HostedTile';
import { hypershiftValue } from './ControlPlaneCommon';

type ControlPlaneFieldProps = {
  input: {
    value: hypershiftValue;
    onChange: (value: hypershiftValue) => void;
  };
  change: ChangeAction;
  formValues: FormikValues;
  hasHostedProductQuota: boolean;
};

const ControlPlaneField = ({
  input: { value, onChange },
  change,
  formValues,
  hasHostedProductQuota,
}: ControlPlaneFieldProps) => {
  const isHostedDisabled = !hasHostedProductQuota;

  React.useEffect(() => {
    if (!value) {
      if (isHostedDisabled) {
        onChange('false');
      } else {
        onChange('true');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (isHypershift: hypershiftValue) => {
    onChange(isHypershift);
    // Uncheck the following Network checkboxes when switching Control plane selection
    change('install_to_vpc', false);
    change('shared_vpc', {
      is_allowed: !isHypershift,
      is_selected: false,
      base_dns_domain: '',
      hosted_zone_id: '',
      hosted_zone_role_arn: '',
    });
    change('configure_proxy', false);

    // Reset VPC settings in case they were configured and then came back to the Control plane step
    change('machinePoolsSubnets', [
      {
        availabilityZone: '',
        privateSubnetId: '',
        publicSubnetId: '',
      },
    ]);

    if (isHypershift === 'true') {
      if (formValues.multi_az === 'true') {
        change('multi_az', 'false');
      }
      if (formValues.applicationIngress === ApplicationIngressType.Custom) {
        change('applicationIngress', ApplicationIngressType.Default);
      }
    }

    // Reset the cluster privacy public subnet when Standalone is chosen.
    if (isHypershift === 'false' && formValues.cluster_privacy_public_subnet_id) {
      change('cluster_privacy_public_subnet_id', '');
    }
  };

  return (
    <>
      <HostedTile
        handleChange={handleChange}
        isSelected={value === 'true'}
        isHostedDisabled={isHostedDisabled}
      />
      <StandAloneTile handleChange={handleChange} isSelected={value === 'false'} />
    </>
  );
};

const ControlPlaneScreen = ({
  change,
  formValues,
  hasHostedProductQuota,
}: {
  change: ChangeAction;
  formValues: FormikValues;
  hasHostedProductQuota: boolean;
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
    <Grid hasGutter className="pf-v5-u-mt-md">
      <GridItem span={10}>
        <WelcomeMessage />
      </GridItem>
      <GridItem span={10}>
        <PrerequisitesInfoBox />
      </GridItem>
      <GridItem span={10}>
        <Title headingLevel="h3" className="pf-v5-u-mb-sm">
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
      hasHostedProductQuota={hasHostedProductQuota}
    />
  </Form>
);

export default ControlPlaneScreen;
