import React from 'react';
import { Alert, AlertVariant, Text, TextVariants } from '@patternfly/react-core';
import InstructionCommand from '~/components/common/InstructionCommand';

import { trackEvents } from '~/common/analytics';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { useGlobalState } from '~/redux/hooks';
import { RosaCliCommand } from '../constants/cliCommands';
import AssociateAWSAccountStep, {
  AssociateAWSAccountStepProps,
} from './common/AssociateAWSAccountStep';

const AccountRoleStep = (props: AssociateAWSAccountStepProps) => {
  const isHypershiftSelected =
    useGlobalState((state) => state.form.CreateCluster?.values?.hypershift) === 'true';
  return (
    <AssociateAWSAccountStep {...props}>
      <Text component={TextVariants.p} className="pf-u-mb-lg">
        To create the necessary account-wide roles and policies quickly, use the default auto method
        that&apos;s provided by the ROSA CLI.
      </Text>
      <InstructionCommand
        trackEvent={trackEvents.CopyCreateAccountRoles}
        textAriaLabel={`Copyable ROSA ${RosaCliCommand.CreateAccountRolesAuto} command`}
        className="pf-u-mb-lg"
      >
        {isHypershiftSelected
          ? RosaCliCommand.CreateAccountRolesHCPAuto
          : RosaCliCommand.CreateAccountRolesAuto}
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
};

export default AccountRoleStep;
