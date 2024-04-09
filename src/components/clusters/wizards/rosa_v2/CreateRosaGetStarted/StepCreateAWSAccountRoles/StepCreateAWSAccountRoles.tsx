import React from 'react';

import { Alert, List, ListComponent, ListItem, OrderType, Title } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { trackEvents } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import { defaultToOfflineTokens, hasRestrictTokensCapability } from '~/common/restrictTokensHelper';
import { loadOfflineToken } from '~/components/CLILoginPage/TokenUtils';
import useOrganization from '~/components/CLILoginPage/useOrganization';
import { RosaCliCommand } from '~/components/clusters/wizards/rosa_v2/AccountsRolesScreen/constants/cliCommands';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import { getRefreshToken, isRestrictedEnv } from '~/restrictedEnv';
import { Error } from '~/types/accounts_mgmt.v1';
import type { Chrome } from '~/types/types';

import ROSALoginCommand from './ROSALoginCommand';

type StepCreateAWSAccountRolesProps = {
  offlineToken?: string;
  setOfflineToken: (token: string) => void;
};

const StepCreateAWSAccountRoles = ({
  offlineToken,
  setOfflineToken,
}: StepCreateAWSAccountRolesProps) => {
  const chrome = useChrome() as Chrome;
  const restrictedEnv = isRestrictedEnv(chrome);
  const { organization, isLoading, error } = useOrganization();
  const [token, setToken] = React.useState<string>('');
  const [restrictTokens, setRestrictTokens] = React.useState<boolean | undefined>(undefined);
  const errorData = error as Error;
  React.useEffect(() => {
    if (restrictedEnv) {
      getRefreshToken(chrome).then((refreshToken) => setToken(refreshToken));
    } else if (offlineToken) {
      setToken(offlineToken as string);
    }
  }, [chrome, restrictedEnv, offlineToken]);

  React.useEffect(() => {
    if (!restrictedEnv && restrictTokens !== undefined && !restrictTokens && !offlineToken) {
      loadOfflineToken(
        (tokenOrError, errorReason) => {
          setOfflineToken(errorReason || tokenOrError);
        },
        window.location.origin,
        chrome,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restrictTokens]);

  React.useEffect(() => {
    // check if using offline tokens is restricted
    if (!restrictedEnv && !isLoading && !error && !!organization?.capabilities) {
      if (hasRestrictTokensCapability(organization.capabilities)) {
        setRestrictTokens(true);
      } else {
        setRestrictTokens(false);
      }
    }
  }, [organization, isLoading, error, restrictedEnv]);

  return (
    <>
      <Title headingLevel="h3">
        Log in to the ROSA CLI with your Red Hat account token and create AWS account roles and
        policies
      </Title>
      <List component={ListComponent.ol} type={OrderType.number}>
        <ListItem className="pf-v5-u-mb-lg">
          To authenticate, run this command:
          <div className="pf-v5-u-mt-md">
            <ROSALoginCommand
              restrictTokens={restrictTokens}
              isLoading={isLoading}
              error={errorData}
              token={token}
              defaultToOfflineTokens={defaultToOfflineTokens}
            />
          </div>
        </ListItem>
        <ListItem>
          To create the necessary account-wide roles and policies quickly, use the default auto
          method that&apos;s provided in the ROSA CLI:
          <InstructionCommand
            trackEvent={trackEvents.CopyCreateAccountRoles}
            textAriaLabel="Copyable ROSA create account-roles command"
            className="pf-v5-u-mt-md"
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
