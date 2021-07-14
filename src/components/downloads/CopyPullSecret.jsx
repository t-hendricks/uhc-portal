import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
} from '@patternfly/react-core';
import { PasteIcon } from '@patternfly/react-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import isEmpty from 'lodash/isEmpty';

import { trackPendo } from '../../common/helpers';

class CopyPullSecret extends React.Component {
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
    const {
      token, text, variant, pendoID,
    } = this.props;
    const isDisabled = (!token || !!token.error || isEmpty(token));
    const { clicked } = this.state;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    if (variant === 'button') {
      return (
        <CopyToClipboard
          text={isDisabled ? '' : tokenView}
          onCopy={this.onCopy}
        >
          <Button
            variant="secondary"
            type="button"
            tabIndex={0}
            isDisabled={isDisabled}
            onClick={() => trackPendo('OCP-Copy-PullSecret', pendoID)}
          >
            {clicked ? 'Copied!' : text}
          </Button>
        </CopyToClipboard>
      );
    }

    return (
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
            onClick={() => trackPendo('OCP-Copy-PullSecret', pendoID)}
          >
            {text}
          </Button>
        </CopyToClipboard>
      </Tooltip>
    );
  }
}
CopyPullSecret.propTypes = {
  pendoID: PropTypes.string,
  token: PropTypes.object.isRequired,
  text: PropTypes.string,
  variant: PropTypes.oneOf(['link', 'button']).isRequired,
};
CopyPullSecret.defaultProps = {
  text: 'Copy pull secret',
};

export default CopyPullSecret;
