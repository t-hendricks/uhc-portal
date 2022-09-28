import React from 'react';
import PropTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Title,
  Button,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
// eslint-disable-next-line camelcase
import { global_success_color_100 } from '@patternfly/react-tokens';

import ErrorBox from '../../../../common/ErrorBox';

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
    <EmptyState variant="large" className="wizard-step-body">
      <EmptyStateIcon icon={CheckCircleIcon} color={global_success_color_100.value} />
      <Title headingLevel="h4" size="lg">
        Scheduled cluster update
      </Title>
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
      <EmptyStateSecondaryActions>
        <Button onClick={close}>Close</Button>
      </EmptyStateSecondaryActions>
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
