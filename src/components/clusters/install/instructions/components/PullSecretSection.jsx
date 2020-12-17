import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
  Tooltip,
} from '@patternfly/react-core';
import { PasteIcon } from '@patternfly/react-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';
import isEmpty from 'lodash/isEmpty';

import { trackPendo } from '../../../../../common/helpers';

class PullSecretSection extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = { clicked: false };

  onCopy = () => {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.setState({ clicked: true }, () => {
      this.timer = window.setTimeout(() => {
        this.setState({ clicked: false });
        this.timer = null;
      }, 2500);
    });
  }

  render() {
    const { token, pendoID, text } = this.props;
    const isDisabled = (!token || !!token.error || isEmpty(token));
    const { clicked } = this.state;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;
    const downloadButton = (
      <Button variant="secondary" isDisabled={isDisabled} onClick={() => trackPendo('OCP-Download-PullSecret', pendoID)}>
        Download pull secret
      </Button>
    );

    return (
      <>
        <Text component="p">
          { text || 'Download or copy your pull secret. The install program will prompt you for your pull secret during installation.'}
        </Text>
        <div>
          {isDisabled ? downloadButton : (
            <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
              {downloadButton}
            </Download>
          )}
          <Tooltip
            trigger="manual"
            content="Copied!"
            position="right"
            isVisible={clicked}
          >
            <CopyToClipboard
              text={isDisabled ? '' : tokenView}
              onCopy={this.onCopy}
            >
              <Button
                variant="link"
                type="button"
                tabIndex={0}
                isDisabled={isDisabled}
                icon={<PasteIcon />}
              >
                Copy pull secret
              </Button>
            </CopyToClipboard>
          </Tooltip>
        </div>
      </>
    );
  }
}

PullSecretSection.propTypes = {
  token: PropTypes.object.isRequired,
  pendoID: PropTypes.string,
  text: PropTypes.string,
};

export default PullSecretSection;
