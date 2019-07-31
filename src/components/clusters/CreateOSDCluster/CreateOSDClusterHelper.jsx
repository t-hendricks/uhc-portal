import React from 'react';
import PropTypes from 'prop-types';
import { HintBlock } from 'patternfly-react';

function AWSCredentialsHint() {
  return (
    <HintBlock
      title="Need help setting up your credentials?"
      body={(
        <React.Fragment>
          <p>
          An AWS access key and secret are a set of credentials for an AWS account.
          These are required to connect to AWS for provisioning the cluster.
          </p>
          <p>
          These credentials must have access to run instances, create VPCs, security groups,
          and IAM roles. See the
            {' '}
            <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-environment">
              AWS documentation
            </a>
            {' '}
          for more information about obtaining and configuring these credentials.
          </p>
        </React.Fragment>
      )}
    />
  );
}

function ConfigurationHint({ showDNSBaseDomain }) {
  return (
    <HintBlock
      title="Basic Configuration"
      body={(
        <React.Fragment>
          <p>
            Your cluster name will be used for the cluster DNS name, so it must not
            contain dots, underscores or special characters.
          </p>
          {showDNSBaseDomain && (
          <p>
            A base domain is an
            <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html"> AWS Route53 </a>
            zone for the cluster.
            A zone with this name must exist on your AWS account,
            and entries created in it are expected to be resolvable
            from the nodes.
          </p>)}
        </React.Fragment>
      )}
    />
  );
}
ConfigurationHint.propTypes = {
  showDNSBaseDomain: PropTypes.bool,
};


function RegionsHint() {
  return (
    <HintBlock
      title="Regions and Zones"
      body={(
        <React.Fragment>
          <p>
            You can select the geographical region for your cluster.
            For some regions, it is possible to deploy the cluster on
            multiple availability zones within the region, for high availability setups.
          </p>
          <p>
            By default, the cluster is deployed on a single availability zone.
          </p>
        </React.Fragment>
      )}
    />
  );
}

function NetworkConfugurationHint() {
  return (
    <HintBlock
      title="Network Configuration"
      body={(
        <React.Fragment>
          <p>
            You can override the default CIDR values for your Machine (Host), Service,
            and Cluster (Pod).
          </p>
          <p>
            Valid CIDR notation includes a prefix, shown as a 4-octet quantity,
            similar to a traditional IPv4 address, followed by the &#34;/&#34; (slash)
            character, followed by a number between 0 and 32 that describes the
            number of significant bits. For example:
            <code>192.168.0.0/16</code>
          </p>
        </React.Fragment>
      )}
    />
  );
}

const constants = {
  spinnerMessage: 'Do not refresh this page. This request may take a moment...',
  credentialsHeader: 'Cloud Provider Credentials',
  configurationHeader: 'Configuration',
};

export {
  AWSCredentialsHint,
  ConfigurationHint,
  RegionsHint,
  NetworkConfugurationHint,
};

export default constants;
