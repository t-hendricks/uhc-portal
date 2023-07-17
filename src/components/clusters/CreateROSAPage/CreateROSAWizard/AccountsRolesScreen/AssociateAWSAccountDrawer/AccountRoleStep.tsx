import React from 'react';
import { Alert, AlertVariant, Text, TextVariants } from '@patternfly/react-core';
import InstructionCommand from '~/components/common/InstructionCommand';

import { trackEvents } from '~/common/analytics';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { RosaCliCommand } from '../constants/cliCommands';
import AssociateAWSAccountStep from './common/AssociateAWSAccountStep';

type AccountRoleStepProps = {
  title: string;
};

const AccountRoleStep = ({ title }: AccountRoleStepProps) => (
  <AssociateAWSAccountStep title={title} contentId="AssociateAWSAccountAccountRoleStep">
    <Text component={TextVariants.p} className="pf-u-mb-lg">
      To create the necessary account-wide roles and policies quickly, use the default auto method
      that&apos;s provided by the ROSA CLI.
    </Text>
    <InstructionCommand
      trackEvent={trackEvents.CopyCreateAccountRoles}
      textAriaLabel={`Copyable ROSA ${RosaCliCommand.CreateAccountRoles}command`}
      className="pf-u-mb-lg"
    >
      {RosaCliCommand.CreateAccountRoles}
    </InstructionCommand>

    <Alert
      variant={AlertVariant.info}
      isInline
      isPlain
      className="pf-u-mb-lg"
      title={
        <>
          If you would prefer to manually create the required roles and policies within your AWS
          account, then follow{' '}
          <ExternalLink href={links.AWS_CLI_GETTING_STARTED_MANUAL} noIcon>
            these instructions
          </ExternalLink>
          .
        </>
      }
    />
  </AssociateAWSAccountStep>
);

export default AccountRoleStep;
