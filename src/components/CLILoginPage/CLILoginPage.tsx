import React from 'react';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageSection } from '@patternfly/react-core';
import { Capability } from '~/types/accounts_mgmt.v1';
import useAccount from './useAccount';
import InstructionsOCM from './Instructions';
import InstructionsROSA from './InstructionsROSA';
import Breadcrumbs from '../common/Breadcrumbs';
import { AppPage } from '../App/AppPage';

export const hasRestrictTokensCapability = (capabilities: Array<Capability>) =>
  capabilities?.some(
    (capability) =>
      capability.name === 'capability.account.restrict_new_offline_tokens' &&
      capability.value === 'true',
  );

type CLILoginPageProps = {
  showToken?: boolean;
  showPath?: string;
  isRosa?: boolean;
};

const CLILoginPage = ({ showToken = false, showPath, isRosa = false }: CLILoginPageProps) => {
  const { userAccount, isLoading, hasError } = useAccount();
  let restrictTokens = false;
  if (!!userAccount?.capabilities) {
    restrictTokens =
      !isLoading && !hasError && hasRestrictTokensCapability(userAccount.capabilities);
  }
  const Instructions = isRosa ? InstructionsROSA : InstructionsOCM;
  const pageTitle = `OpenShift Cluster Manager ${restrictTokens ? 'SSO login' : 'API Token'}`;
  return (
    <AppPage title={`${restrictTokens ? 'SSO Login' : 'API Token'} | OpenShift Cluster Manager`}>
      <PageHeader className="pf-v5-u-mb-md">
        {!restrictTokens && (
          <Breadcrumbs path={[{ label: 'Downloads', path: '/downloads' }, { label: pageTitle }]} />
        )}
        <PageHeaderTitle title={pageTitle} />
      </PageHeader>
      <PageSection>
        <Instructions
          show={showToken}
          showPath={showPath}
          SSOLogin={restrictTokens}
          isRosa={isRosa}
        />
      </PageSection>
    </AppPage>
  );
};

export default CLILoginPage;
