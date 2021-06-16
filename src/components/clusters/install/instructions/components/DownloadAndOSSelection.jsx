import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { get } from 'lodash';

import DownloadButton from './DownloadButton';
import {
  urls, tools, channels, architectures, operatingSystems, operatingSystemOptions,
} from '../../../../../common/installLinks';

/**
 * @returns User's OS (one of `operatingSystems` keys), or null if detection failed.
 */
export function detectOS() {
  const { platform } = window.navigator;
  const macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (macOSPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.mac;
  }
  if (windowsPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.windows;
  }
  if (/Linux/.test(platform)) {
    return operatingSystems.linux;
  }
  return null;
}

const titleOption = { value: 'Select OS', label: 'Select OS', disabled: true };

class DownloadAndOSSelection extends React.Component {
  state = { OS: titleOption.value }

  componentDidMount() {
    const OS = detectOS();
    if (OS && this.urlForOS(OS)) {
      this.setState({ OS });
    }
  }

  onChange = (OS) => {
    this.setState({ OS });
  };

  urlForOS = (OS) => {
    const {
      tool,
      channel,
      architecture,
    } = this.props;
    return get(urls, [tool, channel, architecture, OS]);
  }

  downloadButton = () => {
    const {
      token,
      pendoID,
      tool,
    } = this.props;
    const { OS } = this.state;
    let url;
    let disabled = true;

    if (OS && OS !== titleOption.value) {
      // button should only be enabled if an OS is selected
      url = this.urlForOS(OS);
      disabled = !url;
    }

    return (
      <DownloadButton
        url={url}
        tool={tool}
        disabled={disabled || !!token.error}
        pendoID={pendoID}
      />
    );
  }

  render() {
    const {
      tool,
    } = this.props;
    const { OS } = this.state;

    const isMacInstructions = OS === operatingSystems.mac;
    const isCRC = tool === tools.CRC;

    const options = [
      titleOption,
      ...operatingSystemOptions
        .filter(({ value }) => !!this.urlForOS(value))
        .map(({ value, label }) => (
          { value, label, disabled: false }
        )),
    ];

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
  pendoID: PropTypes.string,
  tool: PropTypes.oneOf(Object.values(tools)).isRequired,
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  architecture: PropTypes.oneOf(Object.values(architectures)).isRequired,
};

export default DownloadAndOSSelection;
