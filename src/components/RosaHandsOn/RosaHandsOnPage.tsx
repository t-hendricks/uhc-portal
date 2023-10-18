import React from 'react';
import * as Sentry from '@sentry/browser';

import { Page } from '@patternfly/react-core';

import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import RosaHandsOnPageContent from './RosaHandsOnPageContent';

import demoExperienceService from './demoExperienceService';
import useDemoExperiencePolling from './useDemoExperiencePolling';
import { AppPage } from '../App/AppPage';

const RosaHandsOnPage = () => {
  const track = useAnalytics();
  const { demoExperience, initializing, initializeError, restartPolling } =
    useDemoExperiencePolling();
  const [requestError, setRequestError] = React.useState<unknown>();
  const [requestingExperience, setRequestingExperience] = React.useState<boolean>(false);

  const requestCluster = async () => {
    try {
      setRequestingExperience(true);
      const response = await demoExperienceService.requestExperience();
      setRequestingExperience(false);
      restartPolling(response.data);
      setRequestError(null);
      track(trackEvents.RequestRosaHandsOnExperience);
    } catch (err) {
      Sentry.captureException(err);
      setRequestError(err);
      setRequestingExperience(false);
    }
  };

  return (
    <AppPage title="ROSA hands-on experience">
      <Page>
        <RosaHandsOnPageContent
          requestError={requestError}
          error={initializeError}
          loading={initializing || requestingExperience}
          demoExperience={demoExperience}
          onRequestCluster={() => requestCluster()}
        />
      </Page>
    </AppPage>
  );
};

export default RosaHandsOnPage;
