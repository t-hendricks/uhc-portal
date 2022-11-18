/*
Copyright (c) 2019 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// This component shows to the user the OpenID refresh token, so that she can
// copy it and use it with command line utitilites like `curl` or OCM.

import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import {
  PageSection,
  Button,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopy,
  List,
  ListItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import links, { tools, channels } from '../../common/installLinks.mjs';
import Breadcrumbs from '../common/Breadcrumbs';
import ExternalLink from '../common/ExternalLink';
import DevPreviewBadge from '../common/DevPreviewBadge';
import DownloadAndOSSelection from '../clusters/install/instructions/components/DownloadAndOSSelection';
import { loadOfflineToken } from './TokenUtils';
import TokenBox from './TokenBox';
import RevokeTokensInstructions from './RevokeTokensInstructions';

import './Tokens.scss';

const defaultLeadingInfo = (
  <>
    <Text component="p">
      Red Hat OpenShift Cluster Manager is a managed service that makes it easy for you to use
      OpenShift without needing to install or upgrade your own OpenShift (Kubernetes) cluster.
    </Text>
    <Title headingLevel="h3">Your API token</Title>
    <Text component="p">
      Use this API token to authenticate against your Red Hat OpenShift Cluster Manager account.
    </Text>
  </>
);

const defaultDocsLink = (
  <ExternalLink href={links.OCM_CLI_DOCS} noIcon>
    read more about setting up the ocm CLI
  </ExternalLink>
);

type Props = {
  blockedByTerms?: boolean;
  commandName?: string;
  commandTool?: string;
  docsLink?: React.ReactNode;
  leadingInfo?: React.ReactNode;
  offlineToken?: string;
  setOfflineToken: (token: string) => void;
  show?: boolean;
  showPath?: string;
};

const Tokens = (props: Props) => {
  const {
    leadingInfo = defaultLeadingInfo,
    show,
    showPath,
    offlineToken,
    commandName = 'ocm',
    commandTool = tools.OCM,
    docsLink = defaultDocsLink,
    setOfflineToken,
    blockedByTerms,
  } = props;

  React.useEffect(() => {
    // After requesting token, we might need to reload page doing stronger auth;
    // after that we want the token to show, but we just loaded.
    document.title = 'API Token | OpenShift Cluster Manager';
    if (!blockedByTerms && show && !offlineToken) {
      // eslint-disable-next-line no-console
      console.log('Tokens: componentDidMount, props =', props);
      loadOfflineToken((tokenOrError, errorReason) => {
        setOfflineToken(errorReason || tokenOrError);
      });
    }
    // No dependencies because this effect should only be run once on mount
  }, []);

  const pageTitle = 'OpenShift Cluster Manager API Token';
  return (
    <>
      <PageHeader>
        <Breadcrumbs path={[{ label: 'Downloads', path: '/downloads' }, { label: pageTitle }]} />
        <PageHeaderTitle title={pageTitle} />
      </PageHeader>
      <PageSection>
        <Stack hasGutter>
          <StackItem>
            <Card className="ocm-c-api-token__card">
              <CardTitle>
                <Title headingLevel="h2">Connect with offline tokens</Title>
              </CardTitle>
              <CardBody className="ocm-c-api-token__card--body">
                <TextContent>{leadingInfo}</TextContent>
                {show || offlineToken ? (
                  <>
                    <TokenBox token={offlineToken} />
                    <TextContent className="pf-u-mt-lg">
                      <Title headingLevel="h3">Using your token in the command line</Title>
                      <List component="ol">
                        <ListItem>
                          Download and install the <code>{commandName}</code> command-line tool:{' '}
                          {commandTool === tools.OCM && <DevPreviewBadge />}
                          <Text component="p" />
                          <DownloadAndOSSelection tool={commandTool} channel={channels.STABLE} />
                          <Text component="p" />
                        </ListItem>
                        <ListItem>
                          Copy and paste the authentication command in your terminal:
                          <Text component="p" />
                          {offlineToken == null ? (
                            <Skeleton size="md" />
                          ) : (
                            <Text component="pre">
                              <ClipboardCopy
                                isReadOnly
                                className="ocm-c-api-token-limit-width"
                                variant="expansion"
                                textAriaLabel="Copyable command"
                              >
                                {`${commandName} login --token="${offlineToken}"`}
                              </ClipboardCopy>
                            </Text>
                          )}
                        </ListItem>
                      </List>

                      <Title headingLevel="h3">Need help connecting with your offline token?</Title>
                      <Text component="p">
                        Run <code>{commandName} login --help</code> for in-terminal guidance, or{' '}
                        {docsLink} for more information about setting up the{' '}
                        <code>{commandName}</code> CLI.
                      </Text>
                    </TextContent>
                  </>
                ) : (
                  <Link to={showPath}>
                    <Button
                      variant="primary"
                      className="pf-u-mt-md"
                      onClick={() =>
                        loadOfflineToken((tokenOrError, errorReason) => {
                          setOfflineToken(errorReason || tokenOrError);
                        })
                      }
                    >
                      Load token
                    </Button>
                  </Link>
                )}
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card className="ocm-c-api-token__card">
              <CardTitle>
                <Title headingLevel="h2">Revoke previous tokens</Title>
              </CardTitle>
              <CardBody className="ocm-c-api-token__card--body">
                <RevokeTokensInstructions />
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default Tokens;
