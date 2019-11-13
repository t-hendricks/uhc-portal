import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Title,
} from '@patternfly/react-core';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import PullSecretSection from './components/PullSecretSection';

function InstructionsPullSecret({ token }) {
  return (
    <React.Fragment>
      <Title headingLevel="h3" size="2xl">
          Pull Secret
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <TelemetryAlert />
          <div className="pf-c-content">
            <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull Secret</h3>
            <PullSecretSection token={token} />
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
}


InstructionsPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPullSecret;
