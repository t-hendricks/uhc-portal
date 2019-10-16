import React from 'react';
import PropTypes from 'prop-types';
import { Card, List, ListItem } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import GetStarted from './components/GetStarted';
import PageTitle from '../../../../common/PageTitle';
import PullSecretSection from './components/PullSecretSection';
import TokenErrorAlert from './components/TokenErrorAlert';

class InstructionsCRC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {
    const { copied } = this.state;
    const { token } = this.props;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    return (
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">
            <div className="developer-preview">
              <CodeIcon />
              {' '}
              Developer Preview
            </div>

            <PageTitle title="Install on Laptop: Red Hat CodeReady Containers" />

            {
              token.error && (
                <TokenErrorAlert token={token} />
              )
            }

            <br />

            <p>
              Red Hat CodeReady Containers brings a minimal OpenShift 4.1 or newer cluster
              to your local laptop or desktop computer.
            </p>

            <GetStarted docURL="https://code-ready.github.io/crc/" />

            <h3>
              Downloads
            </h3>

            <p>
              Download and extract the CodeReady Containers archive for your
              operating system and place the binary in your
              {' '}
              <code>$PATH</code>
              {' '}
              . Run the
              {' '}
              <code>crc setup</code>
              {' '}
              command to set up your host operating system for the
              CodeReady Containers virtual machine.

            </p>

            <List>
              <ListItem>
                <p>
                  Windows:
                  <a
                    href="https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-windows-amd64.zip"
                    disabled={!!token.error}
                  >
                    {' '}
                  Download (HyperV)
                  </a>
                </p>
              </ListItem>
              <ListItem>
                <p>
                  macOS:
                  <a
                    href="https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-macos-amd64.tar.xz"
                    disabled={!token.error}
                  >
                    {' '}
                  Download (HyperKit)
                  </a>
                </p>
              </ListItem>
              <ListItem>
                <p>
                  Linux:
                  <a
                    href="https://mirror.openshift.com/pub/openshift-v4/clients/crc/latest/crc-linux-amd64.tar.xz"
                    disabled={!!token.error}
                  >
                    {' '}
                  Download (Libvirt)
                  </a>
                </p>
              </ListItem>
            </List>

            <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull Secret</h3>
            <PullSecretSection
              copied={copied}
              onCopy={() => {
                this.setState({ copied: true });
                // fix for IE
                document.getElementById('copyPullSecret').focus();
              }}
              token={token}
              tokenView={tokenView}
            />

            <p />

            <p>
              Note: Your CodeReady Container cluster will not show in your list of clusters in
              OpenShift Cluster Manager since it is short lived and occasionally running.
              OpenShift Cluster Manager currently shows only production-level clusters.
            </p>

          </div>
        </div>
      </Card>
    );
  }
}

InstructionsCRC.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsCRC;
