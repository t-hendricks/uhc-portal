import React from 'react';
import PropTypes from 'prop-types';
import { Wizard, Title } from '@patternfly/react-core';

import VersionSelectionGrid from './VersionSelectionGrid';
import UpgradeTimeSelection from './UpgradeTimeSelection';
import FinishedStep from './FinishedStep';

class UpgradeWizard extends React.Component {
  state = {
    selectedVersion: undefined,
    upgradeTimestamp: undefined,
    scheduleType: 'now',
  }

  close = () => {
    const { closeModal, clearPostedUpgradeScheduleResponse } = this.props;
    this.setState({ selectedVersion: undefined, upgradeTimestamp: undefined });
    clearPostedUpgradeScheduleResponse();
    closeModal();
  }

  selectVersion = version => this.setState({ selectedVersion: version });

  setSchedule = ({ timestamp, type }) => this.setState({
    upgradeTimestamp: timestamp, scheduleType: type,
  });

  onNext = (newStep) => {
    const { clusterID, postSchedule } = this.props;
    const { selectedVersion } = this.state;
    const MINUTES_IN_MS = 1000 * 60;
    if (newStep.id === 'finish') {
      postSchedule(clusterID, {
        schedule_type: 'manual',
        upgrade_type: 'OSD',
        next_run: new Date(new Date().getTime() + 6 * MINUTES_IN_MS).toISOString(),
        version: selectedVersion,
      });
    }
  }

  render() {
    const {
      isOpen,
      clusterName,
      clusterVersion,
      upgradeScheduleRequest,
      clusterChannel,
    } = this.props;
    const {
      selectedVersion,
      upgradeTimestamp,
      scheduleType,
    } = this.state;
    const gotAllDetails = selectedVersion && (upgradeTimestamp || scheduleType === 'now');

    const steps = [
      {
        id: 'select-version',
        name: 'Select version',
        component: (
          <VersionSelectionGrid
            clusterVersion={clusterVersion}
            clusterChannel={clusterChannel}
            selected={selectedVersion}
            onSelect={this.selectVersion}
          />
        ),
        enableNext: !!selectedVersion,
      },
      {
        id: 'schedule-upgrade',
        name: 'Schedule upgrade',
        component: (
          <UpgradeTimeSelection
            onSet={this.setSchedule}
            timestamp={upgradeTimestamp}
            type={scheduleType}
          />),
        canJumpTo: !!selectedVersion,
        enableNext: gotAllDetails,
      },
      {
        id: 'confirmation',
        name: 'Confirmation',
        component: (
          <>
            <Title size="lg" headingLevel="h3">Confirmation of your upgrade</Title>
            <dl className="cluster-details-item">
              <dt>Version</dt>
              <dd>
                {clusterVersion}
                {' '}
                &rarr;
                {' '}
                {selectedVersion}
              </dd>
              <dt>Scheduled</dt>
              <dd>Within the next hour</dd>
            </dl>
          </>
        ),
        nextButtonText: 'Confirm upgrade',
        canJumpTo: gotAllDetails,
      },
      {
        id: 'finish',
        name: 'Finish',
        component: (
          <FinishedStep
            onClose={this.closeWizard}
            requestStatus={upgradeScheduleRequest}
            close={this.close}
          />),
        isFinishedStep: true,
      },
    ];
    return isOpen && (
      <Wizard
        title="Upgrade cluster"
        description={clusterName}
        isOpen={isOpen}
        steps={steps}
        onNext={this.onNext}
        onClose={this.close}
      />
    );
  }
}

UpgradeWizard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  clusterName: PropTypes.string,
  clusterID: PropTypes.string,
  clusterVersion: PropTypes.string,
  clusterChannel: PropTypes.string,
  upgradeScheduleRequest: PropTypes.object.isRequired,
  postSchedule: PropTypes.func.isRequired,
  clearPostedUpgradeScheduleResponse: PropTypes.func.isRequired,
};

export default UpgradeWizard;
