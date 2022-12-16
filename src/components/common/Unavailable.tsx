import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  ExpandableSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { Unavailable as FcUnavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import * as Sentry from '@sentry/browser';
import { formatErrorDetails } from '../../common/errors';
import './Unavailable.scss';
import { ErrorState } from '~/types/types';

type ErrorProp = { key?: string; message: string; response: ErrorState };

type Props =
  | {
      errors: ErrorProp[];
      message?: undefined;
      response?: undefined;
    }
  | {
      errors?: undefined;
      message?: string;
      response: ErrorState;
    };

const Unavailable = ({ errors, message = '', response }: Props) => {
  React.useEffect(() => {
    const reportToSentry = (r: ErrorState) => {
      Sentry.withScope((scope) => {
        scope.setTag('operationID', r.operationID ?? '');
        Sentry.captureException(
          new Error(`${r.errorCode} error from server: ${r.internalErrorCode} - ${r.errorMessage}`),
        );
      });
    };
    if (errors) {
      errors.forEach((error) => {
        const { response } = error;
        reportToSentry(response);
      });
    } else {
      reportToSentry(response);
    }
  }, []);
  const errorDetails = ({ response: r, message: m, key = '' }: ErrorProp) => (
    <StackItem key={key}>
      <Stack>
        {m && (
          <StackItem>
            <Title headingLevel="h6">{m}</Title>
          </StackItem>
        )}
        <StackItem>{`Error code: ${r.errorCode}`}</StackItem>
        <StackItem>{r.errorMessage}</StackItem>
        <StackItem>{formatErrorDetails(r.errorDetails)}</StackItem>
        <StackItem>{`Operation ID: ${r.operationID || 'N/A'}`}</StackItem>
      </Stack>
    </StackItem>
  );
  return (
    <EmptyState>
      <EmptyStateBody>
        <FcUnavailable />
        <ExpandableSection id="error-expand" toggleText="Error details">
          <Stack hasGutter>
            {errors ? errors.map(errorDetails) : errorDetails({ response, message })}
          </Stack>
        </ExpandableSection>
      </EmptyStateBody>
    </EmptyState>
  );
};

export default Unavailable;
