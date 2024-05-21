import React from 'react';
import { Field } from 'formik';

import { Form, Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { PrerequisitesInfoBox } from '~/components/clusters/wizards/rosa_v2/common/PrerequisitesInfoBox';
import { WelcomeMessage } from '~/components/clusters/wizards/rosa_v2/common/WelcomeMessage';
import ExternalLink from '~/components/common/ExternalLink';
import AWSLogo from '~/styles/images/AWS.png';
import RedHat from '~/styles/images/Logo-Red_Hat-B-Standard-RGB.png';

import { FieldId, initialValuesHypershift } from '../constants';

import { hypershiftValue } from './ControlPlaneCommon';
import HostedTile from './HostedTile';
import StandAloneTile from './StandAloneTile';

import './controlPlaneScreen.scss';

type ControlPlaneFieldProps = {
  input: {
    value: hypershiftValue;
    onChange: (value: hypershiftValue) => void;
  };
  hasHostedProductQuota: boolean;
};

const ControlPlaneField = ({
  input: { value, onChange },
  hasHostedProductQuota,
}: ControlPlaneFieldProps) => {
  const { values: formValues, setValues } = useFormState();
  const isHostedDisabled = !hasHostedProductQuota;

  React.useEffect(() => {
    if (isHostedDisabled) {
      onChange('false');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (isHypershift: hypershiftValue) => {
    onChange(isHypershift);

    setValues({
      ...formValues,
      ...initialValuesHypershift(isHypershift === 'true'),
      [FieldId.Hypershift]: isHypershift,
      // Uncheck the following Network checkboxes when switching Control plane selection
      [FieldId.InstallToVpc]: false,
      [FieldId.SharedVpc]: {
        is_allowed: isHypershift === 'false',
        is_selected: false,
        base_dns_domain: '',
        hosted_zone_id: '',
        hosted_zone_role_arn: '',
      },
      [FieldId.ConfigureProxy]: false,
      // Reset VPC settings in case they were configured and then came back to the Control plane step
      [FieldId.MachinePoolsSubnets]: [emptyAWSSubnet()],
      // Uncheck fips selection checkbox when switching Control plane selection
      [FieldId.FipsCryptography]: false,
    });
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

const ControlPlaneScreen = ({ hasHostedProductQuota }: { hasHostedProductQuota: boolean }) => {
  const { setFieldValue, getFieldProps, setFieldTouched } = useFormState();
  return (
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
        name={FieldId.Hypershift}
        component={ControlPlaneField}
        validate={(value: hypershiftValue | undefined) =>
          !value ? 'Control plane is required.' : undefined
        }
        input={{
          // name, value, onBlur, onChange
          ...getFieldProps(FieldId.Hypershift),
          onChange: (value: string) => {
            setFieldTouched(FieldId.Hypershift);
            setFieldValue(FieldId.Hypershift, value, false);
          },
        }}
        hasHostedProductQuota={hasHostedProductQuota}
      />
    </Form>
  );
};

export default ControlPlaneScreen;
