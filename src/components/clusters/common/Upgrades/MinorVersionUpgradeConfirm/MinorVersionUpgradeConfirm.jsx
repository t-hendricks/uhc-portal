import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleIcon } from '@patternfly/react-icons';

const MinorVersionUpgradeConfirm = ({
  getAcks,
  isMinorVersionUpgradesEnabled,
  isNextMinorVersionAvailable,
  isAutomatic,
}) => {
  const [clusterUnmetAcks] = getAcks;

  if (
    !isAutomatic ||
    !isNextMinorVersionAvailable ||
    !isMinorVersionUpgradesEnabled ||
    clusterUnmetAcks.length !== 0
  ) {
    return null;
  }
  return (
    <div className="ocm-upgrade-additional-versions-available">
      <InfoCircleIcon />
      Next minor version update allowed.
    </div>
  );
};

MinorVersionUpgradeConfirm.propTypes = {
  isAutomatic: PropTypes.bool,
  isMinorVersionUpgradesEnabled: PropTypes.bool,
  isNextMinorVersionAvailable: PropTypes.bool,
  getAcks: PropTypes.bool,
};

export default MinorVersionUpgradeConfirm;
