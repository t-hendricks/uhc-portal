import React from 'react';

import { Alert, GridItem, Title } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import AwsSubnetFields from './AwsSubnetFields';
import SecurityGroupsSection from './SecurityGroupsSection';

export const AwsVpcSettings = () => {
  const {
    values: {
      [FieldId.UsePrivateLink]: usePrivateLink,
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.MultiAz]: multiAz,
    },
    setFieldValue,
    setFieldTouched,
  } = useFormState();

  const isMultiAz = multiAz === 'true';

  React.useEffect(() => {
    if (!selectedVPC.id) {
      const azCount = isMultiAz ? 3 : 1;
      for (let i = 0; i < azCount; i += 1) {
        [`az_${i}`, `private_subnet_id_${i}`, `public_subnet_id_${i}`].forEach((field) => {
          setFieldValue(field, '');
          setFieldTouched(field, false);
        });
      }
    }
  }, [setFieldValue, isMultiAz, selectedVPC]);

  return (
    <>
      <GridItem>
        <Title headingLevel="h4" size="md">
          Install into an existing VPC
          <PopoverHint
            iconClassName="pf-u-ml-sm"
            hint={
              <>
                Your VPC must have public and private subnets. Public subnets are associated with
                appropriate Ingress rules. Private subnets need appropriate routes and tables.{' '}
                <ExternalLink href={links.INSTALL_AWS_VPC}>
                  Learn more about installing into an existing VPC
                </ExternalLink>
              </>
            }
          />
        </Title>
        <p className="pf-u-mt-sm">
          {`To install into an existing VPC, you need to ensure that your VPC is configured with
                ${
                  !usePrivateLink ? 'a public and' : ''
                } a private subnet for each availability zone that you want the cluster
                installed into.`}{' '}
          <ExternalLink href={links.INSTALL_AWS_CUSTOM_VPC_REQUIREMENTS}>
            Learn more about VPC
          </ExternalLink>
        </p>
      </GridItem>

      <Alert
        variant="info"
        isInline
        title="You'll need to match these VPC subnets when you define the CIDR ranges."
      />

      <AwsSubnetFields />

      <SecurityGroupsSection />
    </>
  );
};
