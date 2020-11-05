import React from 'react';
import PropTypes from 'prop-types';
import './UpdateGraph.scss';

const GraphContainer = ({ children }) => (
  <div
    className="graph"
  >
    {children}
  </div>
);

const GraphLine = ({ children }) => (
  <li className="graph-line">
    {children}
  </li>
);


const GraphPath = ({ children }) => (
  <ul className="graph-path">
    {children}
  </ul>
);

const VersionLabel = ({ children }) => (
  <span
    className="graph-version"
  >
    {children}
  </span>
);


const VersionDot = ({ current }) => (
  <div
    className={`graph-version-dot ${current ? 'current' : ''}`}
  />
);

const UpdateGraph = ({ currentVersion, updateVersion }) => (
  <div className="updates-graph">
    <GraphContainer>
      <GraphPath current>
        <GraphLine>
          <VersionLabel>{currentVersion}</VersionLabel>
          <VersionDot current />
        </GraphLine>
        <GraphLine />
        <GraphLine>
          <VersionLabel>{updateVersion}</VersionLabel>
          <VersionDot />
        </GraphLine>
      </GraphPath>
    </GraphContainer>
  </div>
);

GraphPath.propTypes = {
  children: React.ReactNode,
};

GraphContainer.propTypes = {
  children: React.ReactNode,
};

GraphLine.propTypes = {
  children: React.ReactNode,
};

VersionLabel.propTypes = {
  children: React.ReactNode,
};

VersionDot.propTypes = {
  current: PropTypes.bool,
};

UpdateGraph.propTypes = {
  currentVersion: React.ReactNode,
  updateVersion: React.ReactNode,
};

export default UpdateGraph;
