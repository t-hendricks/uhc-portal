import React from 'react';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { ChromeAPI } from '@redhat-cloud-services/types';
import { PageSection, Alert, Card, CardBody, CardTitle, Title } from '@patternfly/react-core';
import { Capability, Error } from '~/types/accounts_mgmt.v1';
import { isRestrictedEnv } from '~/restrictedEnv';
import useOrganization from './useOrganization';
import InstructionsOCM from './Instructions';
import InstructionsROSA from './InstructionsROSA';
import Breadcrumbs from '../common/Breadcrumbs';
import { AppPage } from '../App/AppPage';

const defaultToOfflineTokens = true;

const ErrorOrLoadingWrapper = ({ children }: { children: React.ReactElement }) => (
  <AppPage title="Openshift Cluster Manager">
    <PageHeader className="pf-v5-u-mb-md">
      <PageHeaderTitle title="Openshift Cluster Manager" />
    </PageHeader>
    <PageSection>
      <Card>
        <CardTitle>
          <Title headingLevel="h2">CLI login</Title>
        </CardTitle>
        <CardBody>{children}</CardBody>
      </Card>
    </PageSection>
  </AppPage>
);

export const hasRestrictTokensCapability = (capabilities: Array<Capability>) =>
  !!capabilities?.length &&
  capabilities.some(
    (capability) =>
      capability.name === 'capability.organization.restrict_new_offline_tokens' &&
      capability.value === 'true',
  );

type CLILoginPageProps = {
  showToken?: boolean;
  showPath?: string;
  isRosa?: boolean;
};

const CLILoginPage = ({ showToken = false, showPath, isRosa = false }: CLILoginPageProps) => {
  const chrome = useChrome();
  const { organization, isLoading, error } = useOrganization();
  const restrictedEnv = isRestrictedEnv(chrome as unknown as ChromeAPI);

  let restrictTokens = false;
  const pageTitle = `OpenShift Cluster Manager ${restrictTokens ? 'SSO login' : 'API Token'}`;
  const Instructions = isRosa ? InstructionsROSA : InstructionsOCM;

  if (!restrictedEnv) {
    const errorData = error as Error;

    if (isLoading) {
      return (
        <ErrorOrLoadingWrapper>
          <Spinner />
        </ErrorOrLoadingWrapper>
      );
    }

    if (error) {
      if (!defaultToOfflineTokens) {
        return (
          <ErrorOrLoadingWrapper>
            <Alert
              variant="danger"
              isInline
              title="Error retrieving user account"
              role="alert"
              className="error-box"
              data-testid="alert-error"
            >
              <p>{errorData.reason}</p>
              <p>{`Operation ID: ${errorData.operation_id || 'N/A'}`}</p>
            </Alert>
          </ErrorOrLoadingWrapper>
        );
      }
    } else {
      restrictTokens =
        !!organization?.capabilities && hasRestrictTokensCapability(organization.capabilities);
    }
  }

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
