import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, EmptyState, EmptyStateBody, EmptyStateVariant, Title,
} from '@patternfly/react-core';
import { OutlinedArrowAltCircleUpIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import './UpgradeStatus.scss';
import UpdateGraph from './UpdateGraph/UpdateGraph';

function UpgradeStatus({
  clusterID,
  canEdit,
  clusterVersion,
  scheduledUpgrade,
  availableUpgrades = [],
  onCancelClick,
  openModal,
}) {
  const hasAvailableUpgrades = availableUpgrades.length > 0;
  const latestAvailable = hasAvailableUpgrades
    ? availableUpgrades[availableUpgrades.length - 1] : undefined;
  const isManualUpgradeScheduled = scheduledUpgrade && scheduledUpgrade.schedule_type === 'manual';

  if (!clusterVersion) {
    return (
      <EmptyState variant={EmptyStateVariant.xs}>
        <Title headingLevel="h4" size="md">
          Update status is not available
        </Title>
        <EmptyStateBody>
          Update status is not available. Try again later.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <>
      <div>
        {hasAvailableUpgrades > 0 ? (
          <>
            <OutlinedArrowAltCircleUpIcon className="ocm-upgrade-available-icon" />
            {' '}
            Upgrade available
          </>
        ) : (
          <>
            <CheckCircleIcon className="ocm-cluster-up-to-date-icon" />
            {' '}
            Up to date
          </>
        )}
        <UpdateGraph
          currentVersion={clusterVersion}
          updateVersion={isManualUpgradeScheduled ? scheduledUpgrade.version : latestAvailable}
          hasMore={!isManualUpgradeScheduled && availableUpgrades.length > 1}
        />

        {scheduledUpgrade && (
          <>
            <div className="ocm-upgrade-status-scheduled-title">Upgrade scheduled</div>
            <DateFormat type="exact" date={Date.parse(scheduledUpgrade.next_run)} />
            {' '}
            {scheduledUpgrade.state?.value === 'started' ? '(Started)' : ''}
            {scheduledUpgrade.state?.value === 'delayed' ? '(Delayed)' : ''}
          </>
        )}
      </div>
      {
    canEdit && scheduledUpgrade && scheduledUpgrade.schedule_type === 'manual' && (
      <Button
        id="ocm-upgrade-status-cancel"
        variant="link"
        onClick={() => {
          if (onCancelClick) {
            onCancelClick();
          }
          openModal('cancel-upgrade', { clusterID, schedule: scheduledUpgrade });
        }}
      >
         Cancel this upgrade
      </Button>
    )
  }
    </>
  );
}

UpgradeStatus.propTypes = {
  clusterID: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  clusterVersion: PropTypes.string,
  scheduledUpgrade: PropTypes.shape({
    version: PropTypes.string,
    next_run: PropTypes.string,
    state: PropTypes.shape({
      value: PropTypes.string,
    }),
    schedule_type: PropTypes.string,
  }),
  onCancelClick: PropTypes.func,
  openModal: PropTypes.func,
  availableUpgrades: PropTypes.arrayOf(PropTypes.string),
};

export default UpgradeStatus;
