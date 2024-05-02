import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { Alert, Button, Split, SplitItem, Text, TextContent } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { Tbody, Td, Tr } from '@patternfly/react-table';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { defaultToOfflineTokens } from '~/common/restrictTokensHelper';

import links from '../../../common/installLinks.mjs';
import AlignRight from '../../common/AlignRight';
import ExternalLink from '../../common/ExternalLink';
import CopyPullSecret from '../CopyPullSecret';
import DownloadPullSecret from '../DownloadPullSecret';
import { expandKeys } from '../downloadsStructure';

import ExpandableRowPair from './ExpandableRowPair';

const commonPropTypes = {
  // { [expandKey]: boolean }
  expanded: PropTypes.object,
  // callback to replace whole `expanded` map
  setExpanded: PropTypes.func,
  // { [expandKey]: ref } - to allow referring to specific row pairs
  toolRefs: PropTypes.object,
};

const PullSecretRow = ({ expanded, setExpanded, toolRefs, token }) => (
  <ExpandableRowPair
    expanded={expanded}
    setExpanded={setExpanded}
    toolRefs={toolRefs}
    expandKey={expandKeys.PULL_SECRET}
    cells={[
      <Td key="pullSecret">Pull secret</Td>,
      <Td key="download">
        <AlignRight>
          <Split hasGutter>
            <SplitItem>
              <CopyPullSecret token={token} text="Copy" variant="link-inplace" />
            </SplitItem>
            <SplitItem>
              <DownloadPullSecret token={token} text="Download" />
            </SplitItem>
          </Split>
        </AlignRight>
      </Td>,
    ]}
    description={
      <TextContent>
        <Text>
          An image pull secret provides authentication for the cluster to access services and
          registries which serve the container images for OpenShift components. Every individual
          user gets a single pull secret generated. The pull secret can be used when installing
          clusters, based on the required infrastructure.
        </Text>
        <Text>
          Learn how to <Link to="/create">create a cluster</Link> or{' '}
          <ExternalLink href={links.OCM_DOCS_PULL_SECRETS}>
            learn more about pull secrets
          </ExternalLink>
          .
        </Text>
      </TextContent>
    }
  />
);

PullSecretRow.propTypes = { ...commonPropTypes };

const ApiTokenRow = ({ expanded, setExpanded, toolRefs }) => (
  <ExpandableRowPair
    expanded={expanded}
    setExpanded={setExpanded}
    toolRefs={toolRefs}
    expandKey={expandKeys.TOKEN_OCM}
    cells={[
      <Td key="name">OpenShift Cluster Manager API Token</Td>,
      <Td key="viewAPI">
        <AlignRight>
          <Link to="/token">
            <Button
              variant="secondary"
              icon={<ArrowRightIcon />}
              data-testid="view-api-token-btn"
              iconPosition="right"
            >
              View API token
            </Button>
          </Link>
        </AlignRight>
      </Td>,
    ]}
    description={
      <Text>
        Use your API token to authenticate against your OpenShift Cluster Manager account.
      </Text>
    }
  />
);

ApiTokenRow.propTypes = { ...commonPropTypes };

const TokenRows = ({
  expanded,
  setExpanded,
  toolRefs,
  token,
  restrictTokens,
  orgRequest,
  restrictedEnv,
}) => {
  const commonProps = { expanded, setExpanded, toolRefs };
  const pullSecretRowProps = { ...commonProps, token };

  if (restrictedEnv) {
    return (
      <>
        <PullSecretRow {...pullSecretRowProps} />
        <ApiTokenRow {...commonProps} />
      </>
    );
  }

  if (restrictTokens) {
    return <PullSecretRow {...pullSecretRowProps} />;
  }

  if (orgRequest.isLoading) {
    return (
      <>
        <PullSecretRow {...pullSecretRowProps} />

        <Tbody>
          <Tr>
            <Td>
              <Spinner centered />
            </Td>
          </Tr>
        </Tbody>
      </>
    );
  }

  if (orgRequest.error && !defaultToOfflineTokens) {
    return (
      <>
        <PullSecretRow {...pullSecretRowProps} />

        <Tbody>
          <Tr>
            <Td />
            <Td id="org-error">
              <Alert variant="danger" isInline title="Error retrieving user account">
                <p>{orgRequest.error.reason}</p>
                <p>{`Operation ID: ${orgRequest.error.operation_id || 'N/A'}`}</p>
              </Alert>
            </Td>
            <Td />
          </Tr>
        </Tbody>
      </>
    );
  }

  return (
    <>
      <PullSecretRow {...pullSecretRowProps} />
      <ApiTokenRow {...commonProps} />
    </>
  );
};

TokenRows.propTypes = {
  ...commonPropTypes,
  orgRequest: PropTypes.shape({
    error: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
  }),
  restrictedEnv: PropTypes.bool,
};

export default TokenRows;
