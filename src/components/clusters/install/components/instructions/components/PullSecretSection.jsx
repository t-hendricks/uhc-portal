import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';

const PullSecretSection = ({
  tokenView, token, onCopy, copied,
}) => (
  <React.Fragment>
    <p>
      Download or copy your pull secret. The install program will prompt you for your pull
      secret during installation.
    </p>
    <div>
      <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
        <Button
          variant="secondary"
          disabled={!token || !!token.error}
        >
          Download pull secret
        </Button>
      </Download>
      <CopyToClipboard
        text={tokenView}
        onCopy={onCopy}
      >
        <span style={{ margin: '10px' }}>
          <button
            id="copyPullSecret"
            className="pf-c-button pf-m-link pf-m-inline install--copy-pull-secret"
            type="button"
            tabIndex="0"
            disabled={!token || !!token.error}
          >
            <span className="fa fa-paste" aria-hidden="true" />
            &nbsp;
            Copy Pull Secret
          </button>
          { copied && ' Copied!' }
        </span>
      </CopyToClipboard>
    </div>
  </React.Fragment>
);
PullSecretSection.propTypes = {
  tokenView: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
  copied: PropTypes.bool.isRequired,
};

export default PullSecretSection;
