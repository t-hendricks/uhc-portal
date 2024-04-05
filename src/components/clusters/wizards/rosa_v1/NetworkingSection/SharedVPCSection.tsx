import React from 'react';
import { Alert, Title, Text } from '@patternfly/react-core';
import { Field } from 'redux-form';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SupportedFeature } from '~/common/featureCompatibility';
import { ReduxCheckbox } from '~/components/common/ReduxFormComponents';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import './SharedVPCSection.scss';
import { isRestrictedEnv } from '~/restrictedEnv';
import SharedVPCField from './SharedVPCField';

const SharedVPCSection = ({
  hostedZoneDomainName,
  isSelected,
  openshiftVersion,
  isHypershiftSelected,
}: {
  hostedZoneDomainName: string;
  isSelected: boolean;
  openshiftVersion: string;
  isHypershiftSelected: boolean;
}) => {
  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.AWS_SHARED_VPC,
    openshiftVersion,
    { day1: true, isHypershift: isHypershiftSelected },
  );
  if (incompatibleReason) {
    return (
      <>
        <Title headingLevel="h3" className="pf-v5-u-mt-lg">
          AWS shared VPC
        </Title>
        <Text>{incompatibleReason}</Text>
      </>
    );
  }

  return (
    <>
      <Title headingLevel="h3">AWS shared VPC</Title>
      {!isRestrictedEnv() && (
        <Field
          component={ReduxCheckbox}
          name="shared_vpc.is_selected"
          label="Install into AWS shared VPC"
          extendedHelpText={
            <>
              Install into a non-default subnet shared by another account in your AWS organization.
              <br />
              <ExternalLink href={links.AWS_SHARED_VPC}>
                Learn more about AWS shared VPC
              </ExternalLink>
            </>
          }
        />
      )}
      {isSelected && (
        <section className="shared-vpc-instructions">
          <Alert
            className="pf-v5-u-mb-md"
            variant="info"
            isInline
            title={
              <>
                NOTE: To continue, you&apos;ll need to fill out all of the information. Some of the
                information, such as Private Hosted Zone ID and Shared VPC Role ARN, must be
                provided by the VPC owner of the AWS account you want to use. If you aren&apos;t the
                VPC owner, reach out to them now.
              </>
            }
          >
            <ExternalLink href={links.ROSA_SHARED_VPC}>
              View instructions on configuring shared VPC for ROSA clusters
            </ExternalLink>
          </Alert>
          <Field
            component={SharedVPCField}
            name="shared_vpc"
            hostedZoneDomainName={hostedZoneDomainName}
          />
        </section>
      )}
    </>
  );
};

export default SharedVPCSection;
