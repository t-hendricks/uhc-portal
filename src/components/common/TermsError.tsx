import React from 'react';
import { AxiosResponse } from 'axios';
import {
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';

import getTermsAppLink from '../../common/getTermsAppLink';

type Props = {
  error: AxiosResponse<{ details?: { ['legal_terms_url']?: string }[] }>;
  restore: () => void;
};

const TermsError = ({ error, restore }: Props) => {
  const tncBaseURL = error.data?.details?.[0]?.legal_terms_url;
  const currentHref = window.location.href;
  const tncAppURL = getTermsAppLink(tncBaseURL, currentHref, currentHref);
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={ExclamationCircleIcon} color={global_danger_color_100.value} />
      <Title headingLevel="h4" size="lg">
        This action is blocked.
      </Title>
      <EmptyStateBody>
        You must accept the Terms and Conditions in order to make changes to this cluster. Your
        cluster will remain unaffected until then. Once you accept the terms, you will need to retry
        the action that was blocked.
      </EmptyStateBody>
      <Button variant="primary" component="a" href={tncAppURL}>
        View Terms and Conditions
      </Button>
      <EmptyStateSecondaryActions>
        <Button variant="link" onClick={restore}>
          Go back to previous page
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

export default TermsError;
