import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, EmptyState, EmptyStateBody, EmptyStateVariant, Title,
} from '@patternfly/react-core';
import { OutlinedArrowAltCircleUpIcon, CheckCircleIcon, InProgressIcon } from '@patternfly/react-icons';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import './UpgradeStatus.scss';
import UpdateGraph from './UpdateGraph/UpdateGraph';

function UpgradeStatus({
  clusterID,
  canEdit,
  clusterVersion,
  clusterVersionRawID,
  scheduledUpgrade,
  availableUpgrades = [],
  onCancelClick,
  openModal,
}) {
  const hasAvailableUpgrades = availableUpgrades.length > 0;

  const isManualUpgradeScheduled = scheduledUpgrade?.schedule_type === 'manual';

  const updateVersion = () => {
    if (scheduledUpgrade?.version) {
      return scheduledUpgrade.version;
    }

    if (!availableUpgrades || availableUpgrades.length === 0) {
      return undefined; // is up to date
    }

    return availableUpgrades[availableUpgrades.length - 1];
  };

  const upgradeState = scheduledUpgrade && scheduledUpgrade.state?.value;
  const canCancel = isManualUpgradeScheduled
                    && canEdit
                    && upgradeState !== 'started'
                    && upgradeState !== 'delayed';

  const upgradeStateIcon = () => {
    let icon;
    let text;
    if (upgradeState === 'started' || upgradeState === 'delayed') {
      icon = <InProgressIcon />;
      if (upgradeState === 'delayed') {
        text = 'Update in progress (delayed)';
      } else {
        text = 'Update in progress';
      }
    } else if (hasAvailableUpgrades) {
      icon = <OutlinedArrowAltCircleUpIcon className="ocm-upgrade-available-icon" />;
      text = 'Update available';
    } else {
      icon = <CheckCircleIcon className="ocm-cluster-up-to-date-icon" />;
      text = 'Up to date';
    }
    return (
      <>
        {icon}
        {' '}
        {text}
      </>
    );
  };

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
        {upgradeStateIcon()}
        <UpdateGraph
          currentVersion={clusterVersionRawID}
          updateVersion={updateVersion()}
          hasMore={!isManualUpgradeScheduled && availableUpgrades.length > 1}
        />

        {scheduledUpgrade && upgradeState !== 'started' && upgradeState !== 'pending' && (
          <>
            <div className="ocm-upgrade-status-scheduled-title">Upgrade scheduled</div>
            <DateFormat type="exact" date={Date.parse(scheduledUpgrade.next_run)} />
          </>
        )}
      </div>
      {
    canCancel && (
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
        Cancel this update
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
  clusterVersionRawID: PropTypes.string,
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
