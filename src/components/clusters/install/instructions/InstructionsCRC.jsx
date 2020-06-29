import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, List, ListItem, Title, Button,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import links from '../../../../common/installLinks';
import PullSecretSection from './components/PullSecretSection';
import TokenErrorAlert from './components/TokenErrorAlert';
import { trackPendo } from '../../../../common/helpers';

function InstructionsCRC({ token }) {
  const cloudProviderID = window.location.pathname;
  const docURL = 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers/1.11/';
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
            <p>
      Follow the
              {' '}
              <a href={docURL} rel="noreferrer noopener" target="_blank" onClick={() => trackPendo('OCP-Download-OfficialDocumentation', cloudProviderID)}>
        official documentation
                {' '}
                <ExternalLinkAltIcon color="#0066cc" size="sm" />
              </a>
              {' '}
      for detailed installation instructions.
            </p>
            <Button
              component="a"
              href={docURL}
              rel="noreferrer noopener"
              target="_blank"
              variant="secondary"
              onClick={() => trackPendo('OCP-Download-OfficialDocumentation', cloudProviderID)}
            >
      Get started
            </Button>
            <p />
            <p>
      Relevant downloads are provided below.
            </p>
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
            <PullSecretSection token={token} cloudProviderID={cloudProviderID} />

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
