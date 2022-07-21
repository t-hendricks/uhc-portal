import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, AlertActionLink, Spinner,
} from '@patternfly/react-core';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/js/icons/arrow-circle-up-icon';
import links from '../../../../../common/installLinks.mjs';
import ExternalLink from '../../../../common/ExternalLink';
import { patchUpgradeSchedule } from '../../../../../services/clusterService';

const actionLink = (onChange, isCurrentlyEnabled) => (
  <AlertActionLink onClick={() => onChange(!isCurrentlyEnabled)}>
    {isCurrentlyEnabled ? 'Disallow this minor version update' : 'Allow the next minor version update' }
  </AlertActionLink>

);

const MinorVersionUpgradeAlert = ({
  isMinorVersionUpgradesEnabled,
  isAutomatic,
  clusterId,
  hasUnmetUpgradeAcknowledge,
  automaticUpgradePolicyId,
  setUpgradePolicy,
  isNextMinorVersionAvailable,
  isRosa,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (
    !isAutomatic
    || hasUnmetUpgradeAcknowledge
    || !automaticUpgradePolicyId
    || !clusterId
    || !isNextMinorVersionAvailable
  ) {
    return null;
  }

  const onChangeAcknowledge = async (isEnable) => {
    setLoading(true);
    setError(null);

    try {
      const response = await patchUpgradeSchedule(
        clusterId,
        automaticUpgradePolicyId,
        { enable_minor_version_upgrades: isEnable },
      );

      // Because this response can be quick, adding loading to prevent a double click
      setTimeout(() => {
        setUpgradePolicy(response.data);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.response.data.reason || err.response.data);
    }
  };

  return error ? (<Alert variant="danger" className="automatic-cluster-updates-alert" isInline title={error} />) : (
    <Alert
      isExpandable
      isInline
      className="automatic-cluster-updates-alert"
      customIcon={<ArrowCircleUpIcon />}
      title={isMinorVersionUpgradesEnabled ? 'Next minor version update allowed' : 'New minor version available'}
      actionLinks={(
        <>
          {loading ? (<Spinner size="sm" aria-label="Setting minor version update status" />)
            : (actionLink(onChangeAcknowledge, isMinorVersionUpgradesEnabled))}
        </>
          )}
    >
      {isMinorVersionUpgradesEnabled
        ? (
          <p data-testid="minorVersionUpgradeAlertDisableMessage">
            Your cluster will be updated to the newest minor version
            {' '}
            at the time you selected. Minor releases can include new Kubernetes
            {' '}
            versions or operating system capabilities, improved automation on IaaS
            {' '}
            providers, and other expanded features.
          </p>
        ) : (
          <p data-testid="minorVersionUpgradeAlertEnableMessage">
            Allow your cluster to be updated to the newest minor version
            {' '}
            at the time you selected.
            {' '}
            <ExternalLink href={isRosa ? links.ROSA_UPGRADES : links.OSD_UPGRADES}>
              Learn more about updates
            </ExternalLink>
          </p>
        )}
    </Alert>
  );
};

MinorVersionUpgradeAlert.propTypes = {
  isMinorVersionUpgradesEnabled: PropTypes.bool,
  isAutomatic: PropTypes.bool,
  hasUnmetUpgradeAcknowledge: PropTypes.bool,
  automaticUpgradePolicyId: PropTypes.string,
  clusterId: PropTypes.string,
  setUpgradePolicy: PropTypes.func,
  isNextMinorVersionAvailable: PropTypes.bool,
  isRosa: PropTypes.bool,
};
MinorVersionUpgradeAlert.defaultProps = {
  isMinorVersionUpgradesEnabled: false,
};

export default MinorVersionUpgradeAlert;
