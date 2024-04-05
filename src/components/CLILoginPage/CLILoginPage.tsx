import React from 'react';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { PageSection, Alert, Card, CardBody, CardTitle, Title } from '@patternfly/react-core';
import { Error } from '~/types/accounts_mgmt.v1';
import { isRestrictedEnv } from '~/restrictedEnv';
import { hasRestrictTokensCapability, defaultToOfflineTokens } from '~/common/restrictTokensHelper';
import { Chrome } from '~/types/types';
import useOrganization from './useOrganization';
import InstructionsOCM from './Instructions';
import InstructionsROSA from './InstructionsROSA';
import Breadcrumbs from '../common/Breadcrumbs';
import { AppPage } from '../App/AppPage';

const ErrorOrLoadingWrapper = ({ children }: { children: React.ReactElement }) => (
  <AppPage title="OpenShift Cluster Manager">
    <PageHeader className="pf-v5-u-mb-md">
      <PageHeaderTitle title="OpenShift Cluster Manager" />
    </PageHeader>
    <PageSection>
      <Card>
        <CardTitle>
          <Title headingLevel="h2">OpenShift Cluster Manager CLI login</Title>
        </CardTitle>
        <CardBody>{children}</CardBody>
      </Card>
    </PageSection>
  </AppPage>
);

type CLILoginPageProps = {
  showToken?: boolean;
  showPath?: string;
  isRosa?: boolean;
};

const CLILoginPage = ({ showToken = false, showPath, isRosa = false }: CLILoginPageProps) => {
  const chrome = useChrome() as Chrome;
  const { organization, isLoading, error } = useOrganization();

  const restrictedEnv = isRestrictedEnv(chrome);
  let restrictTokens = false;

  if (!restrictedEnv) {
    const errorData = error as Error;

    if (isLoading) {
      return (
        <ErrorOrLoadingWrapper>
          <Spinner />
        </ErrorOrLoadingWrapper>
      );
    }

    if (error && !defaultToOfflineTokens) {
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

    restrictTokens =
      !!organization?.capabilities && hasRestrictTokensCapability(organization.capabilities);
  }

  const pageTitle = `OpenShift Cluster Manager ${restrictTokens ? 'SSO login' : 'API Token'}`;
  const Instructions = isRosa ? InstructionsROSA : InstructionsOCM;

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
