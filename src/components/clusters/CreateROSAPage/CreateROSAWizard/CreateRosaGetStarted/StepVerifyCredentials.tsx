import React from 'react';
import { Title, ListComponent, OrderType, List, ListItem, Alert } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import links from '~/common/installLinks.mjs';
import { RosaCliCommand } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/AccountsRolesScreen/constants/cliCommands';
import { trackEvents } from '~/common/analytics';

const StepVerifyCredentials = () => (
  <>
    <Title headingLevel="h3">Verify your credentials and quota</Title>

    <List component={ListComponent.ol} type={OrderType.number}>
      <ListItem className="pf-u-mb-lg">
        To verify that your credentials are set up correctly, run this command:
        <br />
        <InstructionCommand
          textAriaLabel="Copyable ROSA login verification command"
          trackEvent={trackEvents.ROSAWhoAmI}
          className="pf-u-mt-md"
        >
          {RosaCliCommand.WhoAmI}
        </InstructionCommand>
      </ListItem>
      <ListItem>
        To verify that your AWS account has enough{' '}
        <ExternalLink href={links.ROSA_AWS_SERVICE_QUOTAS}>quota</ExternalLink> in the region you
        will be deploying your cluster, run this command:
        <br />
        <InstructionCommand
          textAriaLabel="Copyable ROSA quota verification command"
          trackEvent={trackEvents.ROSAVerifyQuota}
          className="pf-u-mt-md"
        >
          {RosaCliCommand.VerifyQuota}
        </InstructionCommand>
        {/* TODO: PatternFly incorrectly puts the content of an alert as a h4 - this text should not be a heading */}
        <Alert
          variant="info"
          isInline
          isPlain
          title={
            <>
              If you&apos;re using AWS Organizations to manage the AWS accounts that host the ROSA
              service, the organization&apos;s service control policy (SCP) must be configured to
              allow Red Hat to perform{' '}
              <ExternalLink href={links.ROSA_AWS_IAM_RESOURCES} noIcon>
                policy actions
              </ExternalLink>{' '}
              that are listed in the SCP without restriction.
            </>
          }
        />
      </ListItem>
    </List>
  </>
);

export default StepVerifyCredentials;
