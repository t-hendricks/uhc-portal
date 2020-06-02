import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Title,
} from '@patternfly/react-core';
import TelemetryDisclaimer from './components/TelemetryDisclaimer';
import TokenErrorAlert from './components/TokenErrorAlert';
import PullSecretSection from './components/PullSecretSection';

function InstructionsPullSecret({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Pull secret
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <TelemetryDisclaimer />
          <div className="pf-c-content">
            <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull secret</h3>
            <PullSecretSection token={token} />
          </div>
        </div>
      </Card>
    </>
  );
}

InstructionsPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPullSecret;
