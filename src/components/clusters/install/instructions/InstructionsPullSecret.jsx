import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Stack, StackItem, TextContent, Title,
} from '@patternfly/react-core';
import TelemetryDisclaimer from './components/TelemetryDisclaimer';
import TokenErrorAlert from './components/TokenErrorAlert';
import PullSecretSection from './components/PullSecretSection';

function InstructionsPullSecret({ token }) {
  return (
    <>
      <Card>
        <CardBody>
          <div className="pf-c-content ocm-page">
            <Title headingLevel="h3" size="2xl">
              Pull secret
            </Title>
            <Stack hasGutter>
              <StackItem key="pull-secret">
                {token.error && <TokenErrorAlert token={token} />}
                <TextContent>
                  <PullSecretSection token={token} />
                </TextContent>
              </StackItem>
              <StackItem>
                <TelemetryDisclaimer />
              </StackItem>
            </Stack>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

InstructionsPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPullSecret;
