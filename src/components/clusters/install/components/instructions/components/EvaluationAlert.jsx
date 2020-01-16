import React from 'react';
import {
  Alert,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import links from '../../../../../../common/installLinks';

function EvaluationAlert() {
  const title = 'New clusters are automatically registered with a 60-day evaluation subscription.';
  const description = (
    <>
      Evaluation subscriptions do not include support from Red Hat.
      For non-evaluation use, you should attach a subscription that includes support.
      {' '}
      <a href={links.SUBSCRIPTION_EVAL_INFORMATION} target="_blank" rel="noreferrer noopener">
        Learn more
        {' '}
        <ExternalLinkAltIcon color="#0066cc" size="sm" />
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
