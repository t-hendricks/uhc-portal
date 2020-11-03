import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Card,
  CardTitle,
  Title,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import ErrorBox from '../../../../../common/ErrorBox';

class VersionSelectionGrid extends React.Component {
  componentDidMount() {
    this.fetchVersionInfoIfNeeded();
    this.selectDefault();
  }

  componentDidUpdate(prevProps) {
    const { clusterVersion } = this.props;
    if (prevProps.clusterVersion !== clusterVersion) {
      this.fetchVersionInfoIfNeeded();
    }
    this.selectDefault();
  }


  onKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if ([13, 32].includes(event.keyCode)) {
      this.onClick(event);
    }
  }

  onClick = (event) => {
    const { selected, onSelect } = this.props;
    const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
    onSelect(newSelected);
  };

  selectDefault() {
    const { versionInfo, selected, onSelect } = this.props;
    if (versionInfo.fulfilled && versionInfo.availableUpgrades.length === 1 && !selected) {
      // select the version if there's only one available
      onSelect(versionInfo.availableUpgrades[0]);
    }
  }

  fetchVersionInfoIfNeeded() {
    const {
      clusterVersion, clusterChannel, getVersion, versionInfo,
    } = this.props;
    if ((!versionInfo.fulfilled || versionInfo.version !== clusterVersion
         || versionInfo.channelGroup !== clusterChannel)
        && !versionInfo.pending) {
      getVersion(clusterVersion, clusterChannel);
    }
  }


  render() {
    const { versionInfo, clusterVersion, selected } = this.props;
    if (versionInfo.error && !versionInfo.pending) {
      return <ErrorBox message="Error loading version info" response={versionInfo} />;
    }
    if (!versionInfo.fulfilled || versionInfo.pending || clusterVersion !== versionInfo.version) {
      return <Spinner centered />;
    }
    return (
      <>
        <Title size="lg" headingLevel="h3">Select version</Title>
        <Grid hasGutter className="cluster-upgrade-version-selection-grid">
          {versionInfo.availableUpgrades.map(upgradeVersion => (
            <GridItem span={4} key={upgradeVersion}>
              <Card
                id={upgradeVersion}
                onKeyDown={this.onKeyDown}
                onClick={this.onClick}
                isSelectable
                isCompact
                isSelected={selected === upgradeVersion}
              >
                <CardTitle>{upgradeVersion}</CardTitle>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </>
    );
  }
}

VersionSelectionGrid.propTypes = {
  clusterVersion: PropTypes.string.isRequired,
  clusterChannel: PropTypes.string.isRequired,
  getVersion: PropTypes.func.isRequired,
  versionInfo: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
    version: PropTypes.string,
    channelGroup: PropTypes.string,
    availableUpgrades: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};

export default VersionSelectionGrid;
