/* ClipboardCopyLink button is a button (link variant),
that allows you to copy text to the clipboard, and show a Tooltip saying "Copied!"
just like PatternFly's "ClipboardCopy", but without the text input.
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class ClipboardCopyLinkButton extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = {
    copied: false,
  };

  onCopy = () => {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.setState({ copied: true }, () => {
      this.timer = window.setTimeout(() => {
        this.setState({ copied: false });
        this.timer = null;
      }, 2500);
    });
  }

  render() {
    const { text, className, children } = this.props;
    const { copied } = this.state;
    return (
      <Tooltip
        trigger="mouseenter focus click"
        entryDelay={100}
        exitDelay={500}
        content={<div>{copied ? 'Successfuly copied to clipboard!' : 'Copy to clipboard'}</div>}
      >
        <CopyToClipboard text={text} onCopy={this.onCopy}>
          <Button className={className} variant="link">{children}</Button>
        </CopyToClipboard>
      </Tooltip>
    );
  }
}

ClipboardCopyLinkButton.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

export default ClipboardCopyLinkButton;
