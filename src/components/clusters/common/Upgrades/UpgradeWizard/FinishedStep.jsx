import React from 'react';
import PropTypes from 'prop-types';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Spinner,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import ErrorBox from '../../../../common/ErrorBox';

function FinishedStep({
  close,
  scheduleType,
  upgradeTimestamp,
  isPostScheduleError,
  postScheduleError,
  isPostSchedulePending,
}) {
  if (isPostScheduleError) {
    return (
      <Bullseye>
        <ErrorBox message="Failed to schedule upgrade" response={postScheduleError} />
      </Bullseye>
    );
  }
  if (isPostSchedulePending) {
    return (
      <div className="wizard-step-body pf-v6-u-text-align-center">
        <Spinner size="lg" aria-label="Loading..." />
      </div>
    );
  }
  return (
    <EmptyState
      headingLevel="h4"
      icon={CheckCircleIcon}
      titleText="Scheduled cluster update"
      variant="lg"
      className="wizard-step-body"
    >
      <EmptyStateBody>
        Your update was successfully scheduled to start within{' '}
        {scheduleType === 'now' ? (
          'the next hour'
        ) : (
          <>
            one hour of <DateFormat type="exact" date={new Date(upgradeTimestamp)} />
          </>
        )}
        .
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button onClick={close}>Close</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
}

FinishedStep.propTypes = {
  isPostScheduleError: PropTypes.bool,
  postScheduleError: PropTypes.object,
  isPostSchedulePending: PropTypes.bool,
  close: PropTypes.func.isRequired,
  scheduleType: PropTypes.string,
  upgradeTimestamp: PropTypes.string,
};

export default FinishedStep;
