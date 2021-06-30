import React from 'react';
import {
  Alert, GridItem, ExpandableSection, TextContent, Title,
} from '@patternfly/react-core';
import ExternalLink from '../../../../common/ExternalLink';
import { billingModelConstants } from '../../CreateOSDForm/CreateOSDFormConstants';
import AWSAccountDetailsSection from '../../CreateOSDForm/FormSections/AWSAccountDetailsSection';

function AWSByocFields() {
  return (
    <>
      <GridItem span={12}>
        <Alert variant="info" isInline title="Customer cloud subscription">
          Provision your cluster in an AWS account owned by you or your company
          to leverage your existing relationship and pay AWS directly for public cloud costs.
        </Alert>
      </GridItem>
      <GridItem span={12}>
        <Title headingLevel="h3">AWS account details</Title>
      </GridItem>
      <GridItem span={12}>
        <ExpandableSection toggleText="Prerequisites">
          <TextContent>
            Successful cluster provisioning requires that:
            <ul>
              <li>
                Your AWS account has the necessary limits to support your desired cluster size
                according to the
                {' '}
                <ExternalLink noIcon href={billingModelConstants.resourceRequirementsLink}>
                  cluster resource requirements
                </ExternalLink>
                .
              </li>
              <li>
                An IAM user called
                <b>osd-ccs-admin</b>
                {' '}
                exists with the AdministratorAccess policy.
              </li>
              <li>
                An Organization Service Control Policy (SCP) is set up according
                to the requirements for customer cloud subscriptions.
              </li>
            </ul>
            Business Support for AWS is also recommended.
            For more guidance, see the
            {' '}
            <ExternalLink href="https://www.openshift.com/dedicated/ccs">customer cloud subscription requirements</ExternalLink>
            .
          </TextContent>
        </ExpandableSection>
      </GridItem>
      <AWSAccountDetailsSection isWizard />
    </>
  );
}

export default AWSByocFields;
