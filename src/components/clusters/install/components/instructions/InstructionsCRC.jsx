import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, List, ListItem, Title,
} from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import PullSecretSection from './components/PullSecretSection';
import TokenErrorAlert from './components/TokenErrorAlert';

function InstructionsCRC({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Laptop: Red Hat CodeReady Containers
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <div className="pf-c-content">
            <p>
              Red Hat CodeReady Containers brings a minimal OpenShift 4.2 or newer cluster
              to your local laptop or desktop computer.
            </p>

            <GetStarted docURL={links.INSTALL_CRC_GETTING_STARTED} />
          </div>
        </div>
      </Card>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">

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
                    href={links.INSTALL_CRC_DOWNLOAD_WINDOWS}
                    disabled={!!token.error}
                  >
                    {' '}
                  Download (HyperV)
                  </a>
                  <br />
                  Note: Only supported on Windows 10 Pro or Home with the Fall Creatorʼs Update
                  installed.
                  <br />
                  No other version or edition of Windows is supported at this time.
                </p>
              </ListItem>
              <ListItem>
                <p>
                  macOS:
                  <a
                    href={links.INSTALL_CRC_DOWNLOAD_MACOS}
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
                    href={links.INSTALL_CRC_DOWNLOAD_LINUX}
                    disabled={!!token.error}
                  >
                    {' '}
                  Download (Libvirt)
                  </a>
                </p>
              </ListItem>
            </List>

            <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull secret</h3>
            <PullSecretSection token={token} />

            <p />

            <p>
              Note: Your CodeReady Container cluster will not show in your list of clusters in
              OpenShift Cluster Manager since it is short lived and occasionally running.
              OpenShift Cluster Manager currently shows only production-level clusters.
            </p>

          </div>
        </div>
      </Card>
    </>
  );
}

InstructionsCRC.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsCRC;
