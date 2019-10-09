import React from 'react';
import {
  Alert,
  AlertActionCloseButton,
} from '@patternfly/react-core';

const PRERELEASE_42_ALERT_LOCALSTORAGE_KEY = 'prerelease_42_alert_shown';

class PreReleaseInfoBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { alertVisible: this.isShowPrerelease42Alert() };
  }

  hidePrerelease42Alert = () => {
    localStorage.setItem(PRERELEASE_42_ALERT_LOCALSTORAGE_KEY, 'true');
    this.setState({ alertVisible: false });
  };

  isShowPrerelease42Alert = () => localStorage.getItem(PRERELEASE_42_ALERT_LOCALSTORAGE_KEY) !== 'true';

  render() {
    const { alertVisible } = this.state;
    return (
      <React.Fragment>
        {alertVisible && (
          <Alert
            variant="info"
            isInline
            title="OpenShift Container Platform 4.2 upgrades are now available"
            className="preReleaseInfoBox"
            action={<AlertActionCloseButton onClose={this.hidePrerelease42Alert} />}
          >
            Switch to the prerelease-4.2 update channel to verify upgrades on your clusters.
            Upgrades will be advertised in the stable channel following the general availability
            of 4.2.
          </Alert>
        )}
      </React.Fragment>
    );
  }
}

export default PreReleaseInfoBox;
