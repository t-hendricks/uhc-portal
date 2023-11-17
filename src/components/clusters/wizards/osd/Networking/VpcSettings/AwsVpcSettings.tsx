import React from 'react';

import { Alert, GridItem, Title } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { AwsSubnetFields } from '~/components/clusters/wizards/osd/Networking/VpcSettings/AwsSubnetFields';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';

export const AwsVpcSettings = () => {
  const {
    values: { [FieldId.UsePrivateLink]: usePrivateLink },
  } = useFormState();

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
    </>
  );
};
