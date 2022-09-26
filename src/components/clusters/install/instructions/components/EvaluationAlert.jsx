import React from 'react';
import { Alert } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import links from '../../../../../common/installLinks.mjs';

function EvaluationAlert() {
  const title = 'New clusters are automatically registered with a 60-day evaluation subscription.';
  const description = (
    <>
      Evaluation subscriptions do not include support from Red Hat. You can edit your subscription
      settings after the cluster is created to receive support.{' '}
      <a href={links.SUBSCRIPTION_EVAL_INFORMATION} target="_blank" rel="noreferrer noopener">
        Learn more <ExternalLinkAltIcon color="#0066cc" size="sm" />
      </a>
      .
    </>
  );

  return (
    <Alert variant="warning" isInline title={title}>
      {description}
    </Alert>
  );
}

export default EvaluationAlert;
