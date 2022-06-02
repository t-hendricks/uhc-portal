import React from 'react';
import PropTypes from 'prop-types';
import { Alert, List, ListItem } from '@patternfly/react-core';
import ExternalLink from '../../../common/ExternalLink';

function LimitedSupportAlert({ limitedSupportReasons }) {
  if (!limitedSupportReasons || limitedSupportReasons.length === 0) {
    return null;
  }

  const title = `This cluster has limited support${limitedSupportReasons.length > 1 ? ' due to multiple reasons' : ''}.`;

  return (
    <Alert
      id="limited-support-alert"
      variant="danger"
      className="pf-u-mt-md"
      isInline
      isExpandable={limitedSupportReasons.length > 1}
      title={title}
    >
      <List isPlain>
        {limitedSupportReasons.map(reason => (
          <ListItem>
            {reason.summary}
            {' '}
            {reason.details ? (
              <ExternalLink href={reason.details}>Learn more</ExternalLink>
            ) : null}
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}

LimitedSupportAlert.propTypes = {
  limitedSupportReasons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    summary: PropTypes.string,
    details: PropTypes.string,
  })),
};

export default LimitedSupportAlert;
