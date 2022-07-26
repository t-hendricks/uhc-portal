import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertActionLink,
  Alert,
  Button,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import UpgradeAcknowledgeModal from '../UpgradeAcknowledgeModal';
import './UpgradeAcknowledgeWarning.scss';

const UpgradeAcknowledgeWarning = (props) => {
  const {
    openModal,
    toVersion,
    fromVersion,
    clusterId,
    getAcks,
    isPlain,
    isManual,
    isInfo,
    showConfirm,
    openshiftVersion,
    hasScheduledManual,
  } = props;

  const handleButtonClick = () => {
    const [clusterUnmetAcks] = getAcks;
    openModal('ack-upgrade', {
      toVersion,
      fromVersion,
      unmetAcknowledgements: clusterUnmetAcks,
      clusterId,
    });
  };

  const infoTitle = `Administrator acknowledgement is required before updating from ${fromVersion} to ${toVersion}`;

  if (!clusterId || !openshiftVersion) {
    return null;
  }

  const [clusterUnmetAcks, clusterMetAcks] = getAcks;

  const showConfirmMessage = (
    showConfirm
    && clusterUnmetAcks.length === 0
    && clusterMetAcks.length > 0
  );

  return (
    <>
      {clusterUnmetAcks.length > 0 && isManual && isInfo && !hasScheduledManual ? (
        <div className="ocm-upgrade-additional-versions-available" data-testid="infoMessageUnmetAcks">
          <InfoCircleIcon />
          {' '}
          {infoTitle}
        </div>
      ) : null}

      {clusterUnmetAcks.length > 0 && !isManual ? (
        <>
          <UpgradeAcknowledgeModal
            clusterId={clusterId}
          />
          <Alert
            id="upgrade-ack-alert"
            isInline
            isPlain={isPlain}
            variant="warning"
            title={infoTitle}
            data-testid="alertMessageUnmetAcks"
            className={isPlain ? '' : 'automatic-cluster-updates-alert'}
            actionLinks={!isPlain ? (
              <>
                <AlertActionLink
                  onClick={() => handleButtonClick()}
                >
                  Provide approval
                </AlertActionLink>
              </>
            ) : null}
          />
          {isPlain ? (
            <Button variant="secondary" className="ocm-upgrade-approval__provide-button" onClick={() => handleButtonClick()}>Provide approval</Button>
          ) : null}

        </>
      ) : null}

      {showConfirmMessage ? (
        <div className="ocm-upgrade-additional-versions-available" data-testid="confirmAckReceived">
          <InfoCircleIcon />
          Administrator acknowledgement was received.
        </div>
      ) : null}
    </>
  );
};

UpgradeAcknowledgeWarning.propTypes = {
  isPlain: PropTypes.bool, // Show alert with approval button without background
  showConfirm: PropTypes.bool, // If saved acks AND no needed acks, then show info confirm message
  isInfo: PropTypes.bool, // If manual  AND  needed acks, show the alert as information text
  hasScheduledManual: PropTypes.bool, // if manual and there are scheduled update
  openModal: PropTypes.func,
  clusterId: PropTypes.string,
  openshiftVersion: PropTypes.string,
  fromVersion: PropTypes.func,
  toVersion: PropTypes.func,
  getAcks: PropTypes.array,
  isManual: PropTypes.bool,
};

UpgradeAcknowledgeWarning.defaultProps = {
  isPlain: false,
  showConfirm: false,
  isInfo: false,
};

export default UpgradeAcknowledgeWarning;
