import React from 'react';
import { To } from 'react-router-dom';

import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import { defaultToOfflineTokens, hasRestrictTokensCapability } from '~/common/restrictTokensHelper';
import { isRestrictedEnv } from '~/restrictedEnv';
import { Error } from '~/types/accounts_mgmt.v1';

import { AppPage } from '../App/AppPage';
import Breadcrumbs from '../common/Breadcrumbs';

import InstructionsOCM from './Instructions';
import InstructionsROSA from './InstructionsROSA';
import useOrganization from './useOrganization';

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
  showPath?: To;
  isRosa?: boolean;
};

const CLILoginPage = ({ showToken = false, showPath, isRosa = false }: CLILoginPageProps) => {
  const { organization, isLoading, error } = useOrganization();

  const restrictedEnv = isRestrictedEnv();
  let restrictTokens = false;

  if (!restrictedEnv) {
    const errorData = error as Error;

    if (isLoading) {
      return (
        <ErrorOrLoadingWrapper>
          <Spinner size="lg" aria-label="Loading..." />
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
