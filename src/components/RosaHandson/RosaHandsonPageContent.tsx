import React from 'react';
import {
  PageSection,
  Alert,
  Text,
  TextContent,
  Card,
  CardBody,
  Skeleton,
} from '@patternfly/react-core';
import humanizeDuration from 'humanize-duration';

import RosaHandsonPageHeader from './RosaHandsonPageHeader';
import ErrorBoundary from '../App/ErrorBoundary';
import RosaHandsonGetStartedCard from './RosaHandsonGetStartedCard';
import RosaHandsonRecommendedContentTable from './RosaHandsonRecommendedContentTable';
import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import RosaHandsOnLinks from './RosaHandsOnLinks';
import ExternalLink from '../common/ExternalLink';
import RosaHandsonErrorPage from './RosaHandsonErrorPage';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unexpected error';
};

const ExperienceDurationInfo = ({ demoExperience }: { demoExperience: DemoExperience }) => {
  const remainingTime =
    new Date(demoExperience.scheduled_delete_timestamp || '').getTime() - Date.now();
  const remainingDemos = (demoExperience.quota?.limit || 1) - (demoExperience.quota?.current || 1);
  return (
    <Alert
      title={`The current experience demo will end in ${humanizeDuration(remainingTime, {
        units: ['h', 'm'],
        round: true,
        delimiter: ' and ',
      })}. You have ${remainingDemos} experience launches remaining.`}
      variant="info"
      isInline
    />
  );
};

const GetStartedWithRosaButton = () => (
  <ExternalLink href={RosaHandsOnLinks.getStarted}>Get started with ROSA</ExternalLink>
);

const UnavailableAlert = ({ demoExperience }: { demoExperience: DemoExperience }) => {
  const remainingTrials = (demoExperience.quota?.limit || 1) - (demoExperience.quota?.current || 1);
  const alertActions = remainingTrials === 0 ? [<GetStartedWithRosaButton />] : [];
  const alertTitle =
    remainingTrials === 0 ? (
      <>
        After 3 launches, you may create ROSA clusters using a pay-as-you-go option. If you have any
        questions, please contact support by clicking on the hat icon located at the bottom-right
        corner of the page.
      </>
    ) : (
      demoExperience?.unavailable_reason ||
      'This demo is currently unavailable. Please contact support by clicking on the hat icon located at the bottom-right corner of the page.'
    );

  return <Alert title={alertTitle} variant="danger" isInline actionLinks={alertActions} />;
};

const RequestErrorAlert = ({ error }: { error: unknown }) => (
  <Alert title="Failed to request a cluster" variant="danger" isInline>
    {getErrorMessage(error)}
  </Alert>
);

export type RosaHandsonPageContentProps = {
  error: unknown;
  requestError: unknown;
  loading: boolean;
  demoExperience: DemoExperience;
  onRequestCluster: () => void;
};

const RosaHandsonPageContent = ({
  error,
  loading,
  requestError,
  ...props
}: RosaHandsonPageContentProps) => {
  if (error) {
    return <RosaHandsonErrorPage message={getErrorMessage(error)} />;
  }
  const { status } = props.demoExperience;

  return (
    <ErrorBoundary>
      <RosaHandsonPageHeader />
      <>
        {requestError && <RequestErrorAlert error={requestError} />}
        {status === DemoExperienceStatusEnum.Unavailable && <UnavailableAlert {...props} />}
        {status === DemoExperienceStatusEnum.Started && <ExperienceDurationInfo {...props} />}
        <PageSection>
          {loading ? (
            <Card>
              <CardBody style={{ height: '200px' }}>
                <Skeleton height="100%" screenreaderText="Loading Rosa handson demo experience" />
              </CardBody>
            </Card>
          ) : (
            <RosaHandsonGetStartedCard {...props} />
          )}
        </PageSection>
        <PageSection style={{ paddingTop: 'unset' }}>
          <TextContent>
            <Text component="h3">Recommended content</Text>
          </TextContent>
        </PageSection>

        <RosaHandsonRecommendedContentTable />
      </>
    </ErrorBoundary>
  );
};

export default RosaHandsonPageContent;
