import React from 'react';
import PropTypes from 'prop-types';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { global_success_color_100 as successColor } from '@patternfly/react-tokens/dist/esm/global_success_color_100';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import ErrorBox from '../../../../../common/ErrorBox';

function FinishedStep({ requestStatus, close, scheduleType, upgradeTimestamp }) {
  if (requestStatus.error) {
    return (
      <Bullseye>
        <ErrorBox message="Failed to schedule upgrade" response={requestStatus} />
      </Bullseye>
    );
  }
  if (requestStatus.pending || !requestStatus.fulfilled) {
    return <Spinner className="wizard-step-body" centered />;
  }
  return (
    <EmptyState variant="lg" className="wizard-step-body">
      <EmptyStateHeader
        titleText="Scheduled cluster update"
        icon={<EmptyStateIcon icon={CheckCircleIcon} color={successColor.value} />}
        headingLevel="h4"
      />
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
  requestStatus: PropTypes.shape({
    fulfilled: PropTypes.bool,
    error: PropTypes.bool,
    pending: PropTypes.bool,
  }).isRequired,
  close: PropTypes.func.isRequired,
  scheduleType: PropTypes.string,
  upgradeTimestamp: PropTypes.string,
};

export default FinishedStep;
