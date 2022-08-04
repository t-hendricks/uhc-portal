import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
} from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import isEmpty from 'lodash/isEmpty';
import { getTrackEvent, trackEvents } from '~/common/analytics';
import withAnalytics from '~/hoc/withAnalytics';

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
      token, text, variant, pendoID, analytics,
    } = this.props;
    const isDisabled = (!token || !!token.error || isEmpty(token));
    const { clicked } = this.state;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    const linkText = (variant === 'link-inplace' && clicked) ? 'Copied!' : text;

    const button = (
      <CopyToClipboard
        text={isDisabled ? '' : tokenView}
        onCopy={this.onCopy}
      >
        <Button
          variant="link"
          type="button"
          tabIndex={0}
          isAriaDisabled={isDisabled}
          icon={<CopyIcon />}
          onClick={() => {
            const eventObj = getTrackEvent(trackEvents.CopyPullSecret, null, pendoID);
            analytics.track(eventObj.event, eventObj.properties);
          }}
        >
          {linkText}
        </Button>
      </CopyToClipboard>
    );

    if (variant === 'link-inplace') {
      return button;
    }
    return (
      <Tooltip
        trigger="manual"
        content="Copied!"
        position="right"
        isVisible={clicked}
      >
        {button}
      </Tooltip>
    );
  }
}
CopyPullSecret.propTypes = {
  pendoID: PropTypes.string,
  analytics: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  text: PropTypes.string,
  variant: PropTypes.oneOf(['link-tooltip', 'link-inplace']).isRequired,
};
CopyPullSecret.defaultProps = {
  text: 'Copy pull secret',
};

export default withAnalytics(CopyPullSecret);
