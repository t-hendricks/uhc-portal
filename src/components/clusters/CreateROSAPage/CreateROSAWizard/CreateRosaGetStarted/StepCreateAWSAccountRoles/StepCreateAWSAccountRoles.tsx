import React from 'react';
import { Alert, Title, List, ListItem, ListComponent, OrderType } from '@patternfly/react-core';
import TokenBox from '~/components/tokens/TokenBox';
import { trackEvents } from '~/common/analytics';
import { loadOfflineToken } from '~/components/tokens/TokenUtils';
import InstructionCommand from '~/components/common/InstructionCommand';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { RosaCliCommand } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/AccountsRolesScreen/constants/cliCommands';
import { isRestrictedEnv } from '~/restrictedEnv';

type StepCreateAWSAccountRolesProps = {
  offlineToken?: string;
  setOfflineToken: (token: string) => void;
};

const StepCreateAWSAccountRoles = ({
  offlineToken,
  setOfflineToken,
}: StepCreateAWSAccountRolesProps) => {
  const loginCommand = `rosa login${
    isRestrictedEnv() ? ' --govcloud' : ''
  } --token="${offlineToken}"`;

  React.useEffect(() => {
    if (!offlineToken) {
      loadOfflineToken((tokenOrError, errorReason) => {
        setOfflineToken(errorReason || tokenOrError);
      }, window.location.origin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title headingLevel="h3">
        Log in to the ROSA CLI with your Red Hat account token and create AWS account roles and
        policies
      </Title>
      <List component={ListComponent.ol} type={OrderType.number}>
        <ListItem className="pf-u-mb-lg">
          To authenticate, run this command:
          <div className="pf-u-mt-md">
            <TokenBox
              token={offlineToken}
              command={loginCommand}
              textAriaLabel="Copyable ROSA login command"
              trackEvent={trackEvents.ROSALogin}
            />
          </div>
        </ListItem>
        <ListItem>
          To create the necessary account-wide roles and policies quickly, use the default auto
          method that&apos;s provided in the ROSA CLI:
          <InstructionCommand
            trackEvent={trackEvents.CopyCreateAccountRoles}
            textAriaLabel="Copyable ROSA create account-roles command"
            className="pf-u-mt-md"
          >
            {RosaCliCommand.CreateAccountRoles}
          </InstructionCommand>
          {/* TODO: PatternFly incorrectly puts the content of an alert as a h4 - this text should not be a heading */}
          <Alert
            variant="info"
            isInline
            isPlain
            title={
              <>
                If you would prefer to manually create the required roles and policies within your
                AWS account, follow{' '}
                <ExternalLink href={links.AWS_CLI_GETTING_STARTED_MANUAL} noIcon>
                  these instructions
                </ExternalLink>
                .
              </>
            }
          />
        </ListItem>
      </List>
    </>
  );
};

export default StepCreateAWSAccountRoles;
