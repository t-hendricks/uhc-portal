import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import {
  EmptyState,
  EmptyStateBody,
  Title,
  Button,
  PageSection,
} from '@patternfly/react-core';
import { overrideErrorMessage, BANNED_USER_CODE } from '../../common/errors';
import links from '../../common/installLinks.mjs';
import ExternalLink from '../common/ExternalLink';

function SubscriptionNotFulfilled({ data, refresh, marketplace }) {
  const getEmptyState = (title, text, button) => (
    <PageSection className="subscriptions-empty-state">
      <EmptyState>
        <Title headingLevel="h4" size="2xl">
          { title }
        </Title>
        <EmptyStateBody>
          { text }
        </EmptyStateBody>
        { button }
      </EmptyState>
    </PageSection>
  );

  const getErrorText = ({ errorMessage, operationID, internalErrorCode }) => {
    const payload = { code: internalErrorCode };
    const text = BANNED_USER_CODE === payload.code ? overrideErrorMessage(payload) : (
      <>
        <p>
          An error has occured!
          Try again or contact support by including this error message:
        </p>
        <q>
          {errorMessage}
        </q>
        <p>
          {`Operation ID: ${operationID || 'N/A'}`}
        </p>
      </>
    );
    return text;
  };

  const config = {
    account: {
      emptyTitle: 'Unable to retrieve account information',
      errorTitle: 'Unable to retrieve account information',
      text: 'Contact support to verify your account is valid',
    },
    ocp: {
      emptyTitle: 'You do not have any clusters',
      errorTitle: 'Unable to retrieve subscription status',
      text: <p>Create a cluster to get started.</p>,
      emptyButton: <Link to="/install"><Button>Create cluster</Button></Link>,
    },
    osd: {
      emptyTitle: 'You do not have any quota',
      errorTitle: 'Unable to retrieve quota information',
      text: (
        <p>
          <a
            href="https://cloud.redhat.com/products/dedicated/contact/"
            rel="noreferrer noopener"
            target="_blank"
          >
            Contact sales
          </a>
          {' '}
          to get started with OpenShift Dedicated.
        </p>
      ),
    },
    osdmarketplace: {
      emptyTitle: 'Marketplace on-demand subscriptions not detected',
      errorTitle: 'Unable to retrieve quota information',
      text: (
        <p>
          <p>
            No marketplace subscriptions for OpenShift Dedicated or add-ons
            were found in your account
          </p>
          <br />
          <p>
            <Button component="a" href="https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated" variant="primary" rel="noopener noreferrer" target="_blank">
              Enable in Marketplace
            </Button>
          </p>
          <br />
          <ExternalLink href={links.OCM_DOCS_SUBSCRIPTIONS}>
            Learn more
          </ExternalLink>
        </p>
      ),
    },
  };
  let configType = config[data.type];
  if (marketplace) {
    configType = config[`${data.type}marketplace`];
  }

  let content = null;
  if (data.error) {
    const errorText = getErrorText(data);
    const errorButton = <Button onClick={refresh}>Try again</Button>;
    content = getEmptyState(configType.errorTitle, errorText, errorButton);
  } else if (data.pending) {
    content = <PageSection><Spinner centered /></PageSection>;
  } else if (data.empty) {
    content = getEmptyState(configType.emptyTitle, configType.text, configType.emptyButton);
  }
  return content;
}

SubscriptionNotFulfilled.propTypes = {
  data: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  marketplace: PropTypes.bool,
};

export default SubscriptionNotFulfilled;
