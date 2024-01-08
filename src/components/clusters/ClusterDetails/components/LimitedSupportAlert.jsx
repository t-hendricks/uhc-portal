import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import MarkdownParser from '~/common/MarkdownParser';
import ExternalLink from '../../../common/ExternalLink';
import links from '../../../../common/installLinks.mjs';

function LimitedSupportAlert({ limitedSupportReasons, isROSA, isOSD }) {
  if (!limitedSupportReasons || limitedSupportReasons.length === 0) {
    return null;
  }

  const title = `This cluster has limited support${
    limitedSupportReasons.length > 1 ? ' due to multiple reasons' : ''
  }.`;

  return (
    <Alert
      id="limited-support-alert"
      variant="danger"
      className="pf-v5-u-mt-md"
      isInline
      isExpandable={limitedSupportReasons.length > 1}
      title={title}
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
          <DescriptionListGroup key={`reason-${index}`}>
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
}

LimitedSupportAlert.propTypes = {
  limitedSupportReasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      summary: PropTypes.string,
      details: PropTypes.string,
    }),
  ),
  isROSA: PropTypes.bool,
  isOSD: PropTypes.bool,
};

export default LimitedSupportAlert;
