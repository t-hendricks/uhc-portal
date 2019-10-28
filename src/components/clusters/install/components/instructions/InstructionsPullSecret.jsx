import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
} from '@patternfly/react-core';
import TelemetryAlert from './components/TelemetryAlert';
import PullSecretSection from './components/PullSecretSection';
import PageTitle from '../../../../common/PageTitle';

class InstructionsPullSecret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {
    const { copied } = this.state;
    const { token } = this.props;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    return (
      <Card>
        <div className="pf-c-content ocm-page">
          <PageTitle title="Pull Secret" />

          <TelemetryAlert />

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull Secret</h3>
          <PullSecretSection
            copied={copied}
            onCopy={() => {
              this.setState({ copied: true });
              // fix for IE
              document.getElementById('copyPullSecret').focus();
            }}
            token={token}
            tokenView={tokenView}
          />
        </div>
      </Card>
    );
  }
}


InstructionsPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPullSecret;
