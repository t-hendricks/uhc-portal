import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon, MessageDialog, Grid, Col, Form, FormGroup, ControlLabel, FormControl, Button,
  Tooltip, OverlayTrigger, Row,
} from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';


class ClusterCredentialsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userCopied: false,
      passwordCopied: false,
    };
    this.closeDialog = this.closeDialog.bind(this);
  }

  closeDialog() {
    const { close } = this.props; // close comes from Redux
    this.setState({ userCopied: false, passwordCopied: false });
    close();
  }

  render() {
    const { isOpen, credentials } = this.props;
    const { userCopied, passwordCopied } = this.state;
    if (!credentials.admin || !credentials.admin.user || !credentials.admin.password) {
      return null;
    }

    const icon = <Icon type="pf" name="key" />;

    const primaryContent = (
      <React.Fragment>
        <p>
          Use this username and password to access the OpenShift Console.
          These credentials are temporary and should be changed manually,
          once you log in to the OpenShift Console.
          Once the password is changed, the credentials shown here will be invalid.
        </p>
      </React.Fragment>
    );
    const secondaryContent = (
      <Grid fluid>
        <Row>
          <Form horizontal inline>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Username
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={credentials.admin.user} />
                <OverlayTrigger
                  overlay={<Tooltip id="copypassword">{userCopied ? 'Copied' : 'Copy to clipboard'}</Tooltip>}
                  placement="left"
                  shouldUpdatePosition={userCopied}
                >
                  <CopyToClipboard
                    text={credentials.admin.user}
                    onCopy={() => {
                      this.setState({ userCopied: true });
                    }}
                  >
                    <Button className="clustercredentials-copy-button">
                      <Icon type="fa" name="paste" size="xs" />
                    </Button>
                  </CopyToClipboard>
                </OverlayTrigger>
              </Col>
            </FormGroup>
          </Form>
        </Row>
        <Row className="clustercredentials-password-row">
          <Form horizontal inline>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Password
              </Col>
              <Col sm={9}>
                <FormControl type="text" value="****" />
                <OverlayTrigger
                  overlay={<Tooltip id="copypassword">{passwordCopied ? 'Copied' : 'Copy to clipboard'}</Tooltip>}
                  placement="left"
                  shouldUpdatePosition={passwordCopied}
                >
                  <CopyToClipboard
                    text={credentials.admin.password}
                    onCopy={() => {
                      this.setState({ passwordCopied: true });
                    }}
                  >
                    <Button className="clustercredentials-copy-button">
                      <Icon type="fa" name="paste" size="xs" />
                    </Button>
                  </CopyToClipboard>
                </OverlayTrigger>
              </Col>
            </FormGroup>
          </Form>
        </Row>
      </Grid>);

    return isOpen && (
      <MessageDialog
        show={isOpen}
        onHide={this.closeDialog}
        primaryAction={this.closeDialog}
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
