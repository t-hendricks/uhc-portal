import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon, MessageDialog,
} from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';


class ClusterCredentialsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userCopied: false,
      passwordCopied: false,
    };
  }

  render() {
    const {
      isOpen, credentials, close,
    } = this.props;
    const { userCopied, passwordCopied } = this.state;

    const icon = <Icon type="pf" name="key" />;

    const primaryContent = (
      <React.Fragment>
        <p>
          You can copy your administrator credentials here.
          Note that these credentials are temporary and should be changed manually
          from within the cluster. Once changed, the credentials available here will become invalid.
        </p>
      </React.Fragment>
    );
    const secondaryContent = (
      <React.Fragment>
        <CopyToClipboard
          text={credentials.admin.user}
          onCopy={() => {
            this.setState({ userCopied: true });
          }}
        >
          <span style={{ margin: '10px' }}>
            <button
              id="copyUsername"
              type="button"
              tabIndex="0"
            >
              <span className="fa fa-paste" aria-hidden="true" />
              &nbsp;
              Copy Username
            </button>
            { userCopied && ' Copied!' }
          </span>
        </CopyToClipboard>
        <CopyToClipboard
          text={credentials.admin.password}
          onCopy={() => {
            this.setState({ passwordCopied: true });
          }}
        >
          <span style={{ margin: '10px' }}>
            <button
              id="copyPassword"
              type="button"
              tabIndex="0"
            >
              <span className="fa fa-paste" aria-hidden="true" />
              &nbsp;
              Copy Password
            </button>
            { passwordCopied && ' Copied!' }
          </span>
        </CopyToClipboard>

      </React.Fragment>);

    return isOpen && (
      <MessageDialog
        show={isOpen}
        onHide={close}
        primaryAction={close}
        title="Administrator Credentials"
        icon={icon}
        primaryContent={primaryContent}
        secondaryContent={secondaryContent}
        primaryActionButtonContent="Close"
      />
    );
  }
}

ClusterCredentialsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  credentials: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default ClusterCredentialsModal;
