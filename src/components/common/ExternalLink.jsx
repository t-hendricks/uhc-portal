import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const ExternalLink = ({ href, children, noIcon }) => (
  <a href={href} target="_blank" rel="noreferrer noopener">
    {children}
    {!noIcon && (
      <>
        {' '}
        <ExternalLinkAltIcon color="#0066cc" size="sm" />
      </>
    )}
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  noIcon: PropTypes.bool,
};

export default ExternalLink;
