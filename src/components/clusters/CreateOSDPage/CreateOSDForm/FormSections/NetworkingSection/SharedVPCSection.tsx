import React from 'react';
import { Alert, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';

import { ReduxCheckbox } from '~/components/common/ReduxFormComponents';
import ExternalLink from '~/components/common/ExternalLink';
import SharedVPCField from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/SharedVPCField';
import links from '~/common/installLinks.mjs';

import './SharedVPCSection.scss';

const SharedVPCSection = ({
  hostedZoneDomainName,
  isSelected,
}: {
  hostedZoneDomainName: string;
  isSelected: boolean;
}) => (
  <>
    <Title headingLevel="h3">AWS shared VPC</Title>
    <Field
      component={ReduxCheckbox}
      name="shared_vpc.is_selected"
      label="Install into AWS shared VPC"
      extendedHelpText={
        <>
          Install into a non-default subnet shared by another account in your AWS organization.
          <br />
          <ExternalLink href={links.AWS_SHARED_VPC} className="pf-u-mt-sn">
            Learn more about AWS shared VPC
          </ExternalLink>
        </>
      }
    />
    {isSelected && (
      <section className="shared-vpc-instructions">
        <Alert
          className="pf-u-mb-md"
          variant="info"
          isInline
          title={
            <>
              NOTE: To continue, you&apos;ll need to fill out all of the information. Some of the
              information for the AWS participant account must be provided by the Administrator of
              the AWS owner account you want to use. If you aren&apos;t the administrator, reach out
              to them now.
            </>
          }
        >
          <>
            Make sure you both follow the instructions detailed{' '}
            <ExternalLink href={links.ROSA_SHARED_VPC}>here</ExternalLink>
          </>
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

export default SharedVPCSection;
