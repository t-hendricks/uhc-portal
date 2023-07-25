import { PageSection, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { AppPage } from '~/components/App/AppPage';
import { useTCSigned } from './use-tc-signed';
import GovCloudForm from './GovCloudForm';
import GovCloudConfirm from './GovCloudConfirm';
import GovCloudTCPage from './GovCloudTCPage';
import GovCloudPrereqErrorPage from './GovCloudPrereqErrorPage';

import './GovCloudPage.css';

const govCloudTitle = 'FedRAMP ROSA Access';

const GovCloudPage = () => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [tcSigned, redirectURL, isLoading, error] = useTCSigned();

  const onSubmitSuccess = () => {
    setShowConfirm(true);
  };

  let body: React.ReactNode;
  if (error) {
    body = <GovCloudPrereqErrorPage message={error} />;
  } else if (isLoading) {
    body = <Spinner />;
  } else if (!tcSigned) {
    body = <GovCloudTCPage redirectURL={redirectURL} />;
  } else if (showConfirm) {
    body = <GovCloudConfirm />;
  } else {
    body = <GovCloudForm title={govCloudTitle} onSubmitSuccess={onSubmitSuccess} />;
  }

  return (
    <AppPage title={`${govCloudTitle} | Red Hat OpenShift Cluster Manager`}>
      <PageSection className="govcloud-page">{body}</PageSection>
    </AppPage>
  );
};

export default GovCloudPage;
