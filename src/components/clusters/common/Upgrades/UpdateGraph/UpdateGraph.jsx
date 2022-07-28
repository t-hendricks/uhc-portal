import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleIcon } from '@patternfly/react-icons';
import UpgradeAcknowledgeWarning from '../UpgradeAcknowledge/UpgradeAcknowledgeWarning';
import MinorVersionUpgradeConfirm from '../MinorVersionUpgradeConfirm';
import './UpdateGraph.scss';

const GraphContainer = ({ children }) => (
  <div
    className="ocm-upgrade-graph-container"
  >
    {children}
  </div>
);

const GraphLine = ({ children }) => (
  <li className="ocm-upgrade-graph-line">
    {children}
  </li>
);

const GraphPath = ({ children }) => (
  <ul className="ocm-upgrade-graph-path">
    {children}
  </ul>
);

const VersionLabel = ({ children }) => (
  <span
    className="ocm-upgrade-graph-version"
  >
    {children}
  </span>
);

const VersionDot = ({ current }) => (
  <div
    className={`ocm-upgrade-graph-version-dot ${current ? 'ocm-upgrade-current' : ''}`}
  />
);

const UpdateGraph = ({ currentVersion, updateVersion, hasMore }) => (
  <div className="ocm-upgrade-graph">
    <GraphContainer>
      <GraphPath current>
        <GraphLine>
          <VersionLabel>{currentVersion}</VersionLabel>
          <VersionDot current />
        </GraphLine>
        { updateVersion && (
          <>
            <GraphLine />
            <GraphLine>
              <VersionLabel>{updateVersion}</VersionLabel>
              <VersionDot />
            </GraphLine>
          </>
        )}
      </GraphPath>
    </GraphContainer>
    { hasMore && (
      <div className="ocm-upgrade-additional-versions-available">
        <InfoCircleIcon />
        {`Additional versions available between ${currentVersion} and ${updateVersion}`}
      </div>
    )}
    <>
      <UpgradeAcknowledgeWarning isPlain isInfo showConfirm />
      <MinorVersionUpgradeConfirm />
    </>
  </div>
);

GraphPath.propTypes = {
  children: PropTypes.node,
};

GraphContainer.propTypes = {
  children: PropTypes.node,
};

GraphLine.propTypes = {
  children: PropTypes.node,
};

VersionLabel.propTypes = {
  children: PropTypes.node,
};

VersionDot.propTypes = {
  current: PropTypes.bool,
};

UpdateGraph.propTypes = {
  currentVersion: PropTypes.node,
  updateVersion: PropTypes.node,
  hasMore: PropTypes.bool,
};

export default UpdateGraph;
