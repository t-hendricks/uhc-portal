import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Text } from '@patternfly/react-core';

import {
  tools,
  channels,
  operatingSystems,
  urlsSelector,
  githubReleasesToFetch,
} from '../../../../../../common/installLinks.mjs';
import { detectOS, downloadChoice } from '../../../../../downloads/DownloadsPage/DownloadsPage';

const crcInstructionsMapping = {
  [operatingSystems.linux]: (
    <Text>
      Download and extract the OpenShift Local archive for your operating system and place the
      binary in your <code>$PATH</code> .
    </Text>
  ),
  [operatingSystems.mac]: (
    <Text>
      Download and open the OpenShift Local file. Opening the file will automatically start a
      step-by-step installation guide.
    </Text>
  ),
  [operatingSystems.windows]: (
    <Text>
      Download and extract the OpenShift Local archive on your computer and open the installer.
      Opening the installer will automatically start a step-by-step installation guide.
    </Text>
  ),
};

class DownloadAndOSSelection extends React.Component {
  state = {
    selections: {}, // { [tool]: { OS, architecture} }
  };

  componentDidMount() {
    const { githubReleases, getLatestRelease } = this.props;
    githubReleasesToFetch.forEach((repo) => {
      if (!githubReleases[repo].fulfilled) {
        getLatestRelease(repo);
      }
    });
  }

  setSelections = (selections) => {
    this.setState({ selections });
  };

  render() {
    const { pendoID, tool, channel, githubReleases } = this.props;
    const { selections } = this.state;

    const urls = urlsSelector(githubReleases);

    const OS = selections[tool]?.OS || detectOS();
    const isCRC = tool === tools.CRC;

    const chooser = downloadChoice(selections, this.setSelections, urls, tool, channel, {
      pendoID,
    });

    return (
      <>
        {isCRC && crcInstructionsMapping[OS]}
        <Grid hasGutter className="os-based-download">
          <GridItem md={3}>{chooser.osDropdown}</GridItem>
          <GridItem md={4}>{chooser.archDropdown}</GridItem>
          <GridItem md={5}>{chooser.downloadButton}</GridItem>
        </Grid>
      </>
    );
  }
}

DownloadAndOSSelection.propTypes = {
  pendoID: PropTypes.string,
  tool: PropTypes.oneOf(Object.values(tools)).isRequired,
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  githubReleases: PropTypes.object.isRequired,
  getLatestRelease: PropTypes.func.isRequired,
};

export default DownloadAndOSSelection;
