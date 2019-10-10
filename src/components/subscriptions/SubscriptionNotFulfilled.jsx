import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  EmptyState,
  EmptyStateBody,
  Title,
  Button,
} from '@patternfly/react-core';


function SubscriptionNotFulfilled({ data, refresh }) {
  const getEmptyState = (title, text, button) => (
    <EmptyState>
      <Title headingLevel="h4" size="2xl">
        { title }
      </Title>
      <EmptyStateBody>
        { text }
      </EmptyStateBody>
      { button }
    </EmptyState>
  );

  const getErrorText = ({ errorMessage, operationID }) => {
    const text = (
      <>
        <p>
        An error has occured!
        Please try again or contact support by including this error message:
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
      text: 'Please contact support to verify your account is valid',
    },
    ocp: {
      emptyTitle: 'You do not have any clusters',
      errorTitle: 'Unable to retrieve subscription status',
      text: <p>Create a cluster to get started.</p>,
      emptyButton: <Link to="/install"><Button>Create Cluster</Button></Link>,
    },
    osd: {
      emptyTitle: 'You do not have any quota',
      errorTitle: 'Unable to retrieve quota information',
      text: (
        <p>
          <a href="https://www.openshift.com/products/dedicated/contact/" target="_blank">Contact sales</a>
          {' '}
          to get started with OpenShift Dedicated.
        </p>
      ),
    },
  };
  const configType = config[data.type];

  let content = null;
  if (data.error) {
    const errorText = getErrorText(data);
    const errorButton = <Button onClick={refresh}>Try again</Button>;
    content = getEmptyState(configType.errorTitle, errorText, errorButton);
  } else if (data.pending) {
    content = <Spinner centered />;
  } else if (data.empty) {
    content = getEmptyState(configType.emptyTitle, configType.text, configType.emptyButton);
  }
  return content;
}

SubscriptionNotFulfilled.propTypes = {
  data: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default SubscriptionNotFulfilled;
