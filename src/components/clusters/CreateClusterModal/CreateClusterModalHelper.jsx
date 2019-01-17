import React from 'react';
import { HintBlock } from 'patternfly-react';

function AWSCredentialsHint() {
  return (
    <HintBlock
      title="Need help setting up your credentials?"
      style={{ marginTop: '20px' }}
      body={(
        <React.Fragment>
          <p>
          Some details to explain what an AWS access key is and how to create
          an access key onthe AWS Platform.
          </p>
          <p>
          A link to documentation showing how to configure the AWS account.
          </p>
        </React.Fragment>
      )}
    />
  );
}

function ConfigurationHint() {
  return (
    <HintBlock
      title="Basic Configuration"
      body={(
        <React.Fragment>
          <p>
            Your cluster name will be used for the cluster DNS name, so it must not
            contain dots, underscores or special characters.
          </p>
          <p>
            Some information on how to configure the base domain in AWS,
            with link to documentation.
          </p>
        </React.Fragment>
      )}
    />
  );
}


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
            You can override the default CIDR values for your VPC, Service (Portal),
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
  step1Header: 'Step 1: Cloud Provider Credentials',
  step2Header: 'Step 2: Configuration',
};

export {
  AWSCredentialsHint, ConfigurationHint, RegionsHint, NetworkConfugurationHint,
};

export default constants;
