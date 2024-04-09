import React from 'react';

import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';

import { AwsVpcSettings } from './AwsVpcSettings';
import { GcpVpcSettings } from './GcpVpcSettings';

export const VpcSettings = () => {
  const {
    values: { [FieldId.CloudProvider]: cloudProvider },
  } = useFormState();

  return (
    <Form>
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Virtual Private Cloud (VPC) subnet settings</Title>
        </GridItem>

        {cloudProvider === CloudProviderType.Aws && <AwsVpcSettings />}
        {cloudProvider === CloudProviderType.Gcp && <GcpVpcSettings />}
      </Grid>
    </Form>
  );
};
