import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';

function PullSecretSection({
  tokenView, token, onCopy, copied,
}) {
  const isDisabled = (!token || !!token.error);
  const downloadButton = (
    <Button variant="secondary" isDisabled={isDisabled}>
      Download pull secret
    </Button>
  );

  return (
    <React.Fragment>
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
          onCopy={isDisabled ? null : onCopy}
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
              <span className="fa fa-paste" aria-hidden="true" />
              &nbsp;
              Copy Pull Secret
            </Button>
            { !isDisabled && copied && ' Copied!' }
          </span>
        </CopyToClipboard>
      </div>
    </React.Fragment>
  );
}
PullSecretSection.propTypes = {
  tokenView: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
  copied: PropTypes.bool.isRequired,
};

export default PullSecretSection;
