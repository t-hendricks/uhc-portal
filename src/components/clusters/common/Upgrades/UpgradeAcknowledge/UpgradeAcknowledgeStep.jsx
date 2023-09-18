import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  Divider,
  Form,
  FormGroup,
  Grid,
  GridItem,
  TextInput,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '../../../../common/ExternalLink';

import './UpgradeAcknowledgeStep.scss';

const ackWord = 'Acknowledge';

const UpgradeAcknowledgeStep = (props) => {
  const [typedWord, setTypedWord] = useState('');

  const { initiallyConfirmed, confirmed, fromVersion, toVersion, unmetAcknowledgements } = props;

  useEffect(() => {
    if (initiallyConfirmed) {
      setTypedWord(ackWord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typedWord === ackWord) {
      return confirmed(true);
    }
    return confirmed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedWord]);

  return (
    <Grid hasGutter className="ocm-upgrade-ack-step">
      <GridItem>
        <Title className="wizard-step-title" size="lg" headingLevel="h3">
          1. Review and prevent update issues
        </Title>
        <ul className="wizard-step-body">
          {unmetAcknowledgements.map((ack) => (
            <li data-testid="unmetAcknowledgement">
              {ack.description ? <p>{ack.description}</p> : null}
              <Alert
                id="upgrade-ack-alert"
                isPlain
                isInline
                variant="warning"
                title={ack.warning_message}
              >
                {ack.documentation_url ? (
                  <ExternalLink href={ack.documentation_url}>Learn more</ExternalLink>
                ) : null}
              </Alert>
            </li>
          ))}
        </ul>
      </GridItem>

      <Divider />
      <GridItem>
        <Title className="wizard-step-title" size="lg" headingLevel="h3">
          2. Acknowledge
        </Title>
        <div className="wizard-step-body">
          <p>
            {`
              I acknowledge I have resolved any potential update issues on my cluster, 
              and the cluster is ready to update from OpenShift Container Platform
              from ${fromVersion} to ${toVersion}.
              `}
          </p>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormGroup
              label={
                <span className="ocm-upgrade-ack-step_text-input-label">
                  Confirm the above by typing <strong>{ackWord}</strong> below:
                </span>
              }
              isRequired
              fieldId="upgradeAcknowledgementModalText"
            >
              <TextInput
                value={typedWord}
                isRequired
                id="upgradeAcknowledgementModalText"
                type="text"
                onChange={(val) => setTypedWord(val)}
                placeholder="Type here"
                data-testid="acknowledgeTextInput"
              />
            </FormGroup>
          </Form>
        </div>
      </GridItem>
    </Grid>
  );
};

UpgradeAcknowledgeStep.propTypes = {
  confirmed: PropTypes.func, // returns a boolean
  unmetAcknowledgements: PropTypes.array,
  fromVersion: PropTypes.string,
  toVersion: PropTypes.string,
  initiallyConfirmed: PropTypes.bool,
};

UpgradeAcknowledgeStep.defaultProps = {
  initiallyConfirmed: false,
};
export default UpgradeAcknowledgeStep;
