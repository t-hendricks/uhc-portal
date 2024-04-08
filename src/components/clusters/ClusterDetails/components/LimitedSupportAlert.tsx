import {
  Alert,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import React from 'react';
import MarkdownParser from '~/common/MarkdownParser';
import links from '../../../../common/installLinks.mjs';
import ExternalLink from '../../../common/ExternalLink';

type LimitedSupportAlertProps = {
  limitedSupportReasons?: { id?: string; summary?: string; details?: string }[];
  isROSA?: boolean;
  isOSD?: boolean;
};

const LimitedSupportAlert = ({
  limitedSupportReasons,
  isROSA,
  isOSD,
}: LimitedSupportAlertProps) => {
  if (!limitedSupportReasons?.length) {
    return null;
  }

  return (
    <Alert
      id="limited-support-alert"
      variant="danger"
      className="pf-v5-u-mt-md"
      isInline
      role="alert"
      isExpandable={limitedSupportReasons.length > 1}
      title={`This cluster has limited support${
        limitedSupportReasons.length > 1 ? ' due to multiple reasons' : ''
      }.`}
      actionLinks={
        isROSA || isOSD ? (
          <ExternalLink
            href={
              isROSA ? links.ROSA_LIMITED_SUPPORT_DEFINITION : links.OSD_LIMITED_SUPPORT_DEFINITION
            }
          >
            Learn more
          </ExternalLink>
        ) : null
      }
    >
      <DescriptionList>
        {limitedSupportReasons.map((reason, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DescriptionListGroup key={`reason-${index}`} data-testid="dl-group">
            {reason.summary ? <DescriptionListTerm>{reason.summary}</DescriptionListTerm> : null}
            {reason.details ? (
              <DescriptionListDescription>
                <MarkdownParser>{reason.details}</MarkdownParser>
              </DescriptionListDescription>
            ) : null}
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </Alert>
  );
};

export default LimitedSupportAlert;
