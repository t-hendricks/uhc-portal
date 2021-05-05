import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import DownloadButton, { downloadButtonModes } from './DownloadButton';
import { urls } from '../../../../../common/installLinks';

const operatingSystems = {
  LINUX: 'linux',
  MAC: 'mac',
  WINDOWS: 'windows',
};

function detectOS(includeWindows = false) {
  const { platform } = window.navigator;
  const macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (macOSPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.MAC;
  } if (windowsPlatforms.indexOf(platform) !== -1 && includeWindows) {
    return operatingSystems.WINDOWS;
  } if (/Linux/.test(platform)) {
    return operatingSystems.LINUX;
  }
  return 'Select OS';
}

class DownloadAndOSSelection extends React.Component {
  state = { OS: undefined }

  componentDidMount() {
    const { cliTools } = this.props;
    this.setState({ OS: detectOS(cliTools) });
  }

  onChange = (OS) => {
    this.setState({ OS });
  };

  downloadButton = () => {
    const {
      token,
      mode = downloadButtonModes.INSTALLER,
      pendoID,
      channel,
    } = this.props;
    const { OS } = this.state;
    let url;
    let disabled = true;

    if (OS && OS !== 'Select OS') {
      // button should only be enabled if an OS is selected
      const channelAndOsLinks = urls[channel][OS];
      url = mode === downloadButtonModes.CLI_TOOLS
        ? channelAndOsLinks.cli : channelAndOsLinks.installer;
      disabled = !url;
    }

    return (
      <DownloadButton
        token={token}
        url={url}
        mode={mode}
        disabled={disabled}
        pendoID={pendoID}
      />
    );
  }

  render() {
    const { mode = downloadButtonModes.INSTALLER, channel } = this.props;
    const { OS } = this.state;

    let isMacInstructions = false;
    let isCRC = false;
    if (OS === operatingSystems.MAC) {
      isMacInstructions = true;
    }
    if (channel === 'CRC') {
      isCRC = true;
    }

    const options = [
      { value: 'Select OS', label: 'Select OS', disabled: true },
      { value: operatingSystems.LINUX, label: 'Linux', disabled: false },
      { value: operatingSystems.MAC, label: 'MacOS', disabled: false },
    ];
    if (mode !== downloadButtonModes.INSTALLER) {
      options.push({ value: operatingSystems.WINDOWS, label: 'Windows', disabled: false });
    }

    return (
      <>
        {isCRC && (isMacInstructions ? (
          <p>
            Download and open the CodeReady Containers file. Opening the file will automatically
            start a step-by-step installation guide.
            {' '}
          </p>
        ) : (
          <p>
            Download and extract the CodeReady Containers archive for your
            operating system and place the binary in your
            {' '}
            <code>$PATH</code>
            {' '}
            .
          </p>
        ))}
        <Grid hasGutter className="os-based-download">
          <GridItem sm={12} md={6}>
            <FormSelect value={OS} onChange={this.onChange} aria-label="select-os-dropdown">
              {options.map(option => (
                <FormSelectOption isDisabled={option.disabled} key={`OS.${option.value}`} value={option.value} label={option.label} />
              ))}
            </FormSelect>
          </GridItem>
          <GridItem sm={12} md={6}>
            {this.downloadButton()}
          </GridItem>
        </Grid>
      </>
    );
  }
}

DownloadAndOSSelection.propTypes = {
  token: PropTypes.object.isRequired,
  cliTools: PropTypes.bool,
  pendoID: PropTypes.string,
  channel: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['CLI_TOOLS', 'CRC', 'INSTALLER']),
};

export default DownloadAndOSSelection;
