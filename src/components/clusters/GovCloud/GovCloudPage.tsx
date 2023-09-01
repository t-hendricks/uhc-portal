import { PageSection, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { AppPage } from '~/components/App/AppPage';
import { useTCSigned } from './use-tc-signed';
import GovCloudForm from './GovCloudForm';
import GovCloudConfirm from './GovCloudConfirm';
import GovCloudTCPage from './GovCloudTCPage';
import GovCloudPrereqErrorPage from './GovCloudPrereqErrorPage';
import { useHasGovEmail } from './use-gov-email';

import './GovCloudPage.css';

const govCloudTitle = 'FedRAMP ROSA Access';

const GovCloudPage = () => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [tcSigned, redirectURL, tcLoading, tcError] = useTCSigned();
  const [hasGovEmail, emailLoading, emailError] = useHasGovEmail();

  const error = tcError || emailError;
  const loading = tcLoading || emailLoading;
  let body: React.ReactNode;
  if (error) {
    body = <GovCloudPrereqErrorPage message={error} />;
  } else if (loading) {
    body = <Spinner />;
  } else if (!tcSigned) {
    body = <GovCloudTCPage redirectURL={redirectURL} />;
  } else if (showConfirm) {
    body = <GovCloudConfirm />;
  } else {
    body = (
      <GovCloudForm
        title={govCloudTitle}
        onSubmitSuccess={() => setShowConfirm(true)}
        hasGovEmail={hasGovEmail}
      />
    );
  }

  return (
    <AppPage title={`${govCloudTitle} | Red Hat OpenShift Cluster Manager`}>
      <PageSection className="govcloud-page">{body}</PageSection>
    </AppPage>
  );
};

export default GovCloudPage;
