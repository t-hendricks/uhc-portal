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

import RosaHandsOnPageHeader from './RosaHandsOnPageHeader';
import ErrorBoundary from '../App/ErrorBoundary';
import RosaHandsOnGetStartedCard from './RosaHandsOnGetStartedCard';
import RosaHandsOnRecommendedContentTable from './RosaHandsOnRecommendedContentTable';
import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import { rosaHandsOnLinks } from './constants';
import ExternalLink from '../common/ExternalLink';
import RosaHandsOnErrorPage from './RosaHandsOnErrorPage';

const contactSupportText =
  'please contact support by clicking on the hat icon located at the bottom-right corner of the page.';

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
  const remainingDemos = demoExperience.quota.limit - demoExperience.quota.current;
  return (
    <Alert
      title={
        <>
          Your current experience demo will end in{' '}
          {humanizeDuration(remainingTime, {
            units: ['h', 'm'],
            maxDecimalPoints: 2,
            round: true,
            delimiter: ' and ',
          })}
          . You have {remainingDemos} experience launches remaining.
        </>
      }
      variant="info"
      isInline
    />
  );
};

const GetStartedWithRosaButton = () => (
  <ExternalLink href={rosaHandsOnLinks.getStarted}>Get started with ROSA</ExternalLink>
);

const UnavailableAlert = ({ demoExperience }: { demoExperience: DemoExperience }) => {
  const remainingTrials = demoExperience.quota.limit - demoExperience.quota.current;
  const alertActions = remainingTrials === 0 ? [<GetStartedWithRosaButton />] : [];
  const alertTitle =
    remainingTrials === 0 ? (
      <>
        After {demoExperience.quota.limit} launches, you may create ROSA clusters using a
        pay-as-you-go option. If you have any questions, {contactSupportText}
      </>
    ) : (
      demoExperience?.unavailable_reason ||
      `This demo is currently unavailable. If this issue persists, ${contactSupportText}`
    );

  return <Alert title={alertTitle} variant="danger" isInline actionLinks={alertActions} />;
};

const RequestErrorAlert = ({ error }: { error: unknown }) => (
  <Alert title="Failed to request an experience" variant="danger" isInline>
    {getErrorMessage(error)}
  </Alert>
);

export type RosaHandsOnPageContentProps = {
  error: unknown;
  requestError: unknown;
  loading: boolean;
  demoExperience: DemoExperience;
  onRequestCluster: () => void;
};

const RosaHandsOnPageContent = ({
  error,
  loading,
  requestError,
  ...props
}: RosaHandsOnPageContentProps) => {
  if (error) {
    return <RosaHandsOnErrorPage message={getErrorMessage(error)} />;
  }
  const { status } = props.demoExperience;

  return (
    <ErrorBoundary>
      <RosaHandsOnPageHeader />
      <>
        {requestError && <RequestErrorAlert error={requestError} />}
        {status === DemoExperienceStatusEnum.Unavailable && <UnavailableAlert {...props} />}
        {status === DemoExperienceStatusEnum.Started && <ExperienceDurationInfo {...props} />}
        {status === DemoExperienceStatusEnum.Failed && (
          <Alert
            title={`Experience provisioning failed. If this issue persists, ${contactSupportText}`}
            variant="danger"
            isInline
          />
        )}
        <PageSection>
          {loading ? (
            <Card>
              <CardBody style={{ height: '200px' }}>
                <Skeleton height="100%" screenreaderText="Loading Rosa handson demo experience" />
              </CardBody>
            </Card>
          ) : (
            <RosaHandsOnGetStartedCard {...props} />
          )}
        </PageSection>
        <PageSection style={{ paddingTop: 'unset' }}>
          <TextContent>
            <Text component="h3">Recommended content</Text>
          </TextContent>
        </PageSection>

        <RosaHandsOnRecommendedContentTable />
      </>
    </ErrorBoundary>
  );
};

export default RosaHandsOnPageContent;
