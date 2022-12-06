import React from 'react';
import { Card, CardBody, Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import TokenBox from '~/components/tokens/TokenBox';
import { trackEvents } from '~/common/analytics';
import ExternalLink from '../../../../../common/ExternalLink';
import DownloadAndOSSelection from '../../../../install/instructions/components/DownloadAndOSSelection';
import links, { channels, tools } from '../../../../../../common/installLinks.mjs';
import { useGlobalState } from '~/redux/hooks/useGlobalState';

const AuthenticateScreen = () => {
  const token = useGlobalState((state) => state.rosaReducer.offlineToken);
  const loginCommand = `rosa login --token="{{TOKEN}}"`;

  return (
    <Card isCompact isPlain isFullHeight>
      <CardBody>
        <TextContent>
          <Title headingLevel="h2">Download and install the ROSA command line tool</Title>
          <Text component="p">
            Download the ROSA command line (CLI) tools and add them to your <strong>PATH</strong>.{' '}
            <ExternalLink href={links.ROSA_CLI_DOCS}>Help</ExternalLink>
          </Text>
          <Text component="p">
            <DownloadAndOSSelection tool={tools.ROSA} channel={channels.STABLE} pendoID="" />
          </Text>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Note: If you haven’t done so already, also{' '}
            <ExternalLink href={links.AWS_CLI}>install the AWS CLI</ExternalLink> as per your
            operating system.
          </Text>
        </TextContent>
      </CardBody>
      <CardBody>
        <TextContent>
          <Title headingLevel="h2">Authenticate using API token</Title>
          <Text component={TextVariants.p}>
            Run the authentication command in your terminal, and use your API token to authenticate
            against your ROSA account.{' '}
          </Text>
        </TextContent>
        <br />
        <TokenBox
          token={token}
          command={loginCommand}
          textAriaLabel="Copyable ROSA login command"
          trackEvent={trackEvents.ROSALogin}
          showCommandOnError
          outerClassName="ocm-instructions__command"
        />
      </CardBody>
    </Card>
  );
};

export default AuthenticateScreen;
