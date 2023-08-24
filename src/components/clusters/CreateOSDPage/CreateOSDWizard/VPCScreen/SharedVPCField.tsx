import React from 'react';

import get from 'lodash/get';
import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Field } from 'redux-form';

import Instructions from '~/components/common/Instructions';
import Instruction from '~/components/common/Instruction';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { ReduxVerticalFormGroup } from '~/components/common/ReduxFormComponents';
import SharedVPCDomainSelect from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/SharedVPCDomainSelect';
import { required, validatePrivateHostedZoneId, validateRoleARN } from '~/common/validators';

function HostedZoneHelpText({ domainName }: { domainName: string }) {
  return (
    <TextContent>
      <Text component={TextVariants.small} className="pf-u-color-100">
        Enter the private hosted zone ID that&apos;s linked to the AWS owner account you want to
        use. The private hosted zone must have been created with
        <strong className="pf-u-font-size-md"> {domainName} </strong>as the domain name.
        <ExternalLink href={links.AWS_CONSOLE_HOSTED_ZONES}> AWS console</ExternalLink>
      </Text>
    </TextContent>
  );
}

const SharedVPCField = ({
  hostedZoneDomainName,
  meta,
}: {
  hostedZoneDomainName: string;
  meta: {
    touched: boolean;
    error: string;
  };
}) => {
  const getNestedFieldMeta = (fieldName: string) => ({
    error: get(meta.error, fieldName),
    touched: meta.touched,
  });
  return (
    <Grid>
      <GridItem span={10}>
        <Instructions wide>
          <Instruction simple>
            <TextContent className="pf-u-pb-md">
              <Text component={TextVariants.p}>
                Select an existing base DNS domain or reserve a new base DNS domain.
              </Text>
            </TextContent>

            <Field
              label="Base DNS domain"
              name="shared_vpc.base_dns_domain"
              validate={required}
              component={SharedVPCDomainSelect}
              meta={getNestedFieldMeta('base_dns_domain')}
              isRequired
            />
          </Instruction>

          <Instruction simple>
            <TextContent className="pf-u-pb-md">
              <Text component={TextVariants.p}>
                Associate your DNS domain with a private hosted zone.
              </Text>
            </TextContent>
            <Field
              label="Private hosted zone ID"
              name="shared_vpc.hosted_zone_id"
              component={ReduxVerticalFormGroup}
              validate={validatePrivateHostedZoneId}
              meta={getNestedFieldMeta('hosted_zone_id')}
              showHelpTextOnError={false}
              helpText={<HostedZoneHelpText domainName={hostedZoneDomainName} />}
              isRequired
            />
          </Instruction>

          <Instruction simple>
            <TextContent className="pf-u-pb-md">
              <Text component={TextVariants.p}>Provide the role ARN for the existing VPC.</Text>
            </TextContent>
            <Field
              label="Shared VPC role"
              name="shared_vpc.hosted_zone_role_arn"
              component={ReduxVerticalFormGroup}
              validate={validateRoleARN}
              meta={getNestedFieldMeta('hosted_zone_role_arn')}
              isRequired
            />
          </Instruction>
        </Instructions>
      </GridItem>
    </Grid>
  );
};

export default SharedVPCField;
