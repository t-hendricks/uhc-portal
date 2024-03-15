import React from 'react';
import { AxiosResponse } from 'axios';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';

import getTermsAppLink from '../../../common/getTermsAppLink';
import { ViewTermsButton } from './ViewTermsButton';

type Props = {
  error: AxiosResponse<{ details?: { ['legal_terms_url']?: string }[] }>;
  restore: () => void;
};

const TermsError = ({ error, restore }: Props) => {
  const tncBaseURL = error.data?.details?.[0]?.legal_terms_url;
  const currentHref = window.location.href;
  const tncAppURL = getTermsAppLink(tncBaseURL, currentHref, currentHref);

  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="This action is blocked."
        icon={<EmptyStateIcon icon={ExclamationCircleIcon} color={dangerColor.value} />}
        headingLevel="h4"
      />
      <EmptyStateBody>
        You must accept the Terms and Conditions in order to make changes to this cluster. Your
        cluster will remain unaffected until then. Once you accept the terms, you will need to retry
        the action that was blocked.
      </EmptyStateBody>
      <EmptyStateFooter>
        <ViewTermsButton href={tncAppURL} />
        <EmptyStateActions>
          <Button variant="link" onClick={restore}>
            Go back to previous page
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default TermsError;
