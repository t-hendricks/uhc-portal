import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect, FormSelectOption,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import DownloadButton from './DownloadButton';
import { channels, urls } from '../../../../../common/installLinks';

const operatingSystems = {
  LINUX: 'Linux',
  MAC: 'MacOS',
  WINDOWS: 'Windows',
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
      cliTools = false,
      cloudProviderID = null,
      channel,
    } = this.props;
    const { OS } = this.state;
    let url;
    let disabled = false;

    // eslint-disable-next-line default-case
    switch (channel) {
      case (channels.STABLE):
        switch (OS) {
          case (operatingSystems.LINUX):
            url = cliTools ? urls.stable.linux.cli : urls.stable.linux.installer;
            break;
          case (operatingSystems.MAC):
            url = cliTools ? urls.stable.mac.cli : urls.stable.mac.installer;
            break;
          case (operatingSystems.WINDOWS):
            if (cliTools) {
              url = urls.stable.windows.cli;
            } else {
              disabled = true;
            }
            break;
          default:
            disabled = true;
        }
        break;
      case (channels.PRE_RELEASE):
        switch (OS) {
          case (operatingSystems.LINUX):
            url = cliTools ? urls.preRelease.linux.cli : urls.preRelease.linux.installer;
            break;
          case (operatingSystems.MAC):
            url = cliTools ? urls.preRelease.mac.cli : urls.preRelease.mac.installer;
            break;
          case (operatingSystems.WINDOWS):
            if (cliTools) {
              url = urls.preRelease.windows.cli;
            } else {
              disabled = true;
            }
            break;
          default:
            disabled = true;
        }
        break;
      case (channels.IBMZ):
        switch (OS) {
          case (operatingSystems.LINUX):
            url = cliTools ? urls.ibmz.linux.cli : urls.ibmz.linux.installer;
            break;
          case (operatingSystems.MAC):
            url = cliTools ? urls.ibmz.mac.cli : urls.ibmz.mac.installer;
            break;
          case (operatingSystems.WINDOWS):
            if (cliTools) {
              url = urls.ibmz.windows.cli;
            } else {
              disabled = true;
            }
            break;
          default:
            disabled = true;
        }
        break;
    }
    return (
      <DownloadButton
        token={token}
        url={url}
        disabled={disabled}
        cliTools={cliTools}
        cloudProviderID={cloudProviderID}
      />
    );
  }

  render() {
    const { cliTools = false } = this.props;
    const { OS } = this.state;

    const options = [
      { value: 'Select OS', label: 'Select OS', disabled: true },
      { value: 'Linux', label: 'Linux', disabled: false },
      { value: 'MacOS', label: 'MacOS', disabled: false },
    ];
    if (cliTools) {
      options.push({ value: 'Windows', label: 'Windows', disabled: false });
    }

    return (
      <Split gutter="sm" className="os-based-download">
        <SplitItem span={4}>
          <FormSelect value={OS} onChange={this.onChange} aria-label="select-os-dropdown">
            {options.map(option => (
              <FormSelectOption isDisabled={option.disabled} key={`OS.${option.value}`} value={option.value} label={option.label} />
            ))}
          </FormSelect>
        </SplitItem>
        <SplitItem span={5}>
          {this.downloadButton()}
        </SplitItem>
        <SplitItem span={3} />
      </Split>
    );
  }
}

DownloadAndOSSelection.propTypes = {
  token: PropTypes.object.isRequired,
  cliTools: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  channel: PropTypes.string.isRequired,
};

export default DownloadAndOSSelection;
