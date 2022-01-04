import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Text,
} from '@patternfly/react-core';
import { has, get } from 'lodash';

import DownloadButton from './DownloadButton';
import {
  urls, tools, channels, operatingSystems,
} from '../../../../../common/installLinks';
import {
  detectOS,
  initialSelection,
  architecturesForToolOS,
  operatingSystemDropdown,
  architectureDropdown,
} from '../../../../downloads/DownloadsPage/DownloadsPage';

const crcInstructionsMapping = {
  [operatingSystems.linux]: (
    <Text>
      Download and extract the CodeReady Containers archive for your
      operating system and place the binary in your
      {' '}
      <code>$PATH</code>
      {' '}
      .
    </Text>
  ),
  [operatingSystems.mac]: (
    <Text>
      Download and open the CodeReady Containers file. Opening the file will automatically
      start a step-by-step installation guide.
    </Text>
  ),
  [operatingSystems.windows]: (
    <Text>
      Download and extract the CodeReady Containers archive on your computer and open the
      installer. Opening the installer will automatically start a step-by-step installation guide.
    </Text>
  ),
};

const toolRow = (selections, setSelections, tool, channel, token, pendoID) => {
  const { OS, architecture } = (
    selections[tool] || initialSelection(urls, tool, channel, detectOS())
  );
  // Callbacks for dropdowns:
  const onChangeOS = (newOS) => {
    let newArchitecture = architecture;
    // Invalidate arch selection if not compatible
    if (!has(urls, [tool, channel, architecture, newOS])) {
      const optionsForOS = architecturesForToolOS(urls, tool, channel, newOS);
      newArchitecture = optionsForOS.length > 1 ? 'select' : optionsForOS[0].value;
    }
    setSelections({ ...selections, [tool]: { OS: newOS, architecture: newArchitecture } });
  };
  const onChangeArchitecture = (newArchitecture) => {
    setSelections({ ...selections, [tool]: { OS, architecture: newArchitecture } });
  };

  const url = get(urls, [tool, channel, architecture, OS]);
  return {
    osDropdown: operatingSystemDropdown(urls, tool, channel, OS, onChangeOS),
    archDropdown: architectureDropdown(urls, tool, channel, OS, architecture, onChangeArchitecture),
    downloadButton: (
      <DownloadButton
        url={url}
        tool={tool}
        disabled={!!token.error}
        pendoID={pendoID}
      />
    ),
  };
};

class DownloadAndOSSelection extends React.Component {
  state = {
    selections: {}, // { [tool]: { OS, architecture} }
  }

  setSelections = (selections) => {
    this.setState({ selections });
  }

  render() {
    const {
      token,
      pendoID,
      tool,
      channel,
    } = this.props;
    const { selections } = this.state;

    const OS = selections[tool]?.OS || detectOS();
    const isCRC = tool === tools.CRC;

    const chooser = toolRow(selections, this.setSelections, tool, channel, token, pendoID);

    return (
      <>
        {isCRC && crcInstructionsMapping[OS]}
        <Grid hasGutter className="os-based-download">
          <GridItem md={3}>
            {chooser.osDropdown}
          </GridItem>
          <GridItem md={4}>
            {chooser.archDropdown}
          </GridItem>
          <GridItem md={5}>
            {chooser.downloadButton}
          </GridItem>
        </Grid>
      </>
    );
  }
}

DownloadAndOSSelection.propTypes = {
  token: PropTypes.object.isRequired,
  pendoID: PropTypes.string,
  tool: PropTypes.oneOf(Object.values(tools)).isRequired,
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
};

export default DownloadAndOSSelection;
