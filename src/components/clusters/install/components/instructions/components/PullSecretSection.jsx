import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { PasteIcon } from '@patternfly/react-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';

class PullSecretSection extends React.Component {
  state = { copied: false }

  render() {
    const { token } = this.props;
    const { copied } = this.state;
    const isDisabled = (!token || !!token.error);
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    const downloadButton = (
      <Button variant="secondary" isDisabled={isDisabled}>
      Download pull secret
      </Button>
    );

    return (
      <>
        <p>
        Download or copy your pull secret. The install program will prompt you for your pull
        secret during installation.
        </p>
        <div>
          {isDisabled ? downloadButton : (
            <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
              {downloadButton}
            </Download>
          )}
          <CopyToClipboard
            text={isDisabled ? '' : tokenView}
            onCopy={isDisabled ? null : () => { this.setState({ copied: true }); }}
          >
            <span style={{ margin: '10px' }}>
              <Button
                variant="link"
                id="copyPullSecret"
                className="install--copy-pull-secret"
                type="button"
                tabIndex="0"
                isDisabled={isDisabled}
              >
                <PasteIcon color="#0066cc" size="sm" />
              &nbsp;
              Copy pull secret
              </Button>
              { !isDisabled && copied && ' Copied!' }
            </span>
          </CopyToClipboard>
        </div>
      </>
    );
  }
}

PullSecretSection.propTypes = {
  token: PropTypes.object.isRequired,
};

export default PullSecretSection;
