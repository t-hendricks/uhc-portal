import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Title,
  Divider,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import last from 'lodash/last';
import ErrorBox from '../../../../../common/ErrorBox';
import { versionRegEx } from '../../clusterUpgardeHelpers';
import VersionCard from './VersionCard';

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

  recommendedCards(latestInCurrMinor, latestVersion) {
    const { selected } = this.props;
    const latestVersionParts = versionRegEx.exec(latestVersion).groups;
    return (
      <>
        {
              latestInCurrMinor ? (
                <GridItem span={6}>
                  <VersionCard
                    isRecommended
                    isSelected={selected === latestInCurrMinor}
                    version={latestInCurrMinor}
                    onKeyDown={this.onKeyDown}
                    onClick={this.onClick}
                  >
                      The latest on your current minor version.
                  </VersionCard>
                </GridItem>
              ) : null
            }
        {
              latestVersion !== latestInCurrMinor ? (
                <GridItem span={6}>
                  <VersionCard
                    isRecommended
                    isSelected={selected === latestVersion}
                    version={latestVersion}
                    onKeyDown={this.onKeyDown}
                    onClick={this.onClick}
                  >
                    Start taking advantage of the new features
                    {' '}
                    {`${latestVersionParts.major}.${latestVersionParts.minor}`}
                    {' '}
                      has to offer.
                  </VersionCard>
                </GridItem>
              ) : null
            }
      </>
    );
  }

  render() {
    const { versionInfo, clusterVersion, selected } = this.props;
    if (versionInfo.error && !versionInfo.pending) {
      return <ErrorBox message="Error loading version info" response={versionInfo} />;
    }
    if (!versionInfo.fulfilled || versionInfo.pending || clusterVersion !== versionInfo.version) {
      return <Spinner centered />;
    }

    const { availableUpgrades } = versionInfo;
    const latestVersion = last(availableUpgrades);
    const clusterVersionParts = versionRegEx.exec(clusterVersion).groups;
    const versionsInCurrMinor = availableUpgrades.filter((v) => {
      const currVersionParts = versionRegEx.exec(v).groups;
      if (
        currVersionParts.major === clusterVersionParts.major
        && currVersionParts.minor === clusterVersionParts.minor
      ) {
        return true;
      }
      return false;
    });
    const latestInCurrMinor = last(versionsInCurrMinor);
    const otherVersions = availableUpgrades.filter(v => v !== latestVersion
      && v !== latestInCurrMinor);
    return (
      <>
        <Title className="version-select-step-title" size="lg" headingLevel="h3">Select version</Title>
        <div id="version-grid-wrapper">
          <Grid hasGutter className="version-selection-grid">
            {
              this.recommendedCards(latestInCurrMinor, latestVersion)
            }
            {otherVersions.length > 0 && (
            <GridItem span={12}>
              <Divider />
            </GridItem>
            )}
            {otherVersions.map(upgradeVersion => (
              <GridItem span={4} key={upgradeVersion}>
                <VersionCard
                  version={upgradeVersion}
                  onKeyDown={this.onKeyDown}
                  onClick={this.onClick}
                  isSelected={selected === upgradeVersion}
                />
              </GridItem>
            ))}
          </Grid>
        </div>

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
