import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Title,
  Divider,
} from '@patternfly/react-core';
import last from 'lodash/last';
import { versionRegEx } from '../../../../../../common/versionComparator';
import VersionCard from './VersionCard';

class VersionSelectionGrid extends React.Component {
  componentDidMount() {
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
    const { availableUpgrades, selected, onSelect } = this.props;
    if (availableUpgrades.length === 1 && !selected) {
      // select the version if there's only one available
      onSelect(availableUpgrades[0]);
    }
  }

  recommendedCards(latestInCurrMinor, latestVersion) {
    const { selected, getUnMetClusterAcknowledgements } = this.props;
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
                    getUnMetClusterAcknowledgements={getUnMetClusterAcknowledgements}
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
                    getUnMetClusterAcknowledgements={getUnMetClusterAcknowledgements}
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
    const {
      availableUpgrades, clusterVersion, selected, getUnMetClusterAcknowledgements,
    } = this.props;

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
            <GridItem>
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
                  getUnMetClusterAcknowledgements={getUnMetClusterAcknowledgements}
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
  availableUpgrades: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
  getUnMetClusterAcknowledgements: PropTypes.func,
};

export default VersionSelectionGrid;
