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

import RosaHandsOnErrorPage from './RosaHandsOnErrorPage';
import RosaHandsOnContactSupport from './RosaHandsOnContactSupport';
import { AugmentedDemoExperience } from './augmentedModelTypes';
import { DemoExperienceStatusEnum } from './DemoExperienceModels';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unexpected error';
};

const StatusAlert = ({ demoExperience }: { demoExperience: AugmentedDemoExperience }) => {
  const remainingTime =
    new Date(demoExperience.scheduled_delete_timestamp || '').getTime() - Date.now();
  const remainingQuota = demoExperience.quota.limit - demoExperience.quota.current;
  let alert;
  switch (demoExperience.status) {
    case 'quota-exceeded':
      alert = (
        <Alert
          title={
            <>
              After {demoExperience.quota.limit} launches, you can create ROSA clusters using a
              pay-as-you-go option. If you have any questions, you can <RosaHandsOnContactSupport />
              .
            </>
          }
          isInline
          variant="info"
        />
      );
      break;
    case DemoExperienceStatusEnum.Started:
      alert = (
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
              . You have {remainingQuota} experience launches remaining.
            </>
          }
          variant="info"
          isInline
        />
      );
      break;
    case DemoExperienceStatusEnum.Failed:
      alert = (
        <Alert
          title={
            <>
              We&apos;re experiencing an error on our end. This does not affect your quota. Try
              again and if this issue persists, <RosaHandsOnContactSupport />.
            </>
          }
          variant="danger"
          isInline
        />
      );
      break;
    case DemoExperienceStatusEnum.Unavailable:
      alert = (
        <Alert
          title={
            <>
              The demo system is currently unavailable. If this issue persists, you can{' '}
              <RosaHandsOnContactSupport />.
            </>
          }
          variant="danger"
          isInline
        >
          {demoExperience.unavailable_reason}
        </Alert>
      );
      break;
    case DemoExperienceStatusEnum.Available:
      alert =
        demoExperience.quota.current > 0 ? (
          <Alert
            variant="info"
            isInline
            title={
              <>
                You have {remainingQuota} launches remaining. If you have any questions, you can{' '}
                <RosaHandsOnContactSupport />.
              </>
            }
          />
        ) : null;
      break;
    default:
      alert = null;
  }
  return <>{alert}</>;
};

export type RosaHandsOnPageContentProps = {
  error: unknown;
  requestError: unknown;
  loading: boolean;
  demoExperience: AugmentedDemoExperience;
  onRequestCluster: () => void;
};

const RosaHandsOnPageContent = ({
  error,
  loading,
  requestError,
  demoExperience,
  onRequestCluster,
}: RosaHandsOnPageContentProps) => {
  if (error) {
    return <RosaHandsOnErrorPage message={getErrorMessage(error)} />;
  }

  return (
    <ErrorBoundary>
      <RosaHandsOnPageHeader />
      <StatusAlert demoExperience={demoExperience} />
      {requestError && (
        <Alert title="Failed to request an experience" variant="danger" isInline>
          {getErrorMessage(error)}
        </Alert>
      )}
      <>
        <PageSection>
          {loading ? (
            <Card>
              <CardBody style={{ height: '200px' }}>
                <Skeleton height="100%" screenreaderText="Loading Rosa handson demo experience" />
              </CardBody>
            </Card>
          ) : (
            <>
              <RosaHandsOnGetStartedCard
                onRequestCluster={onRequestCluster}
                demoExperience={demoExperience}
              />
            </>
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
