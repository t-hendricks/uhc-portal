import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const ExternalLink = ({ href, children, noIcon, noTarget, className, stopClickPropagation }) => (
  <a
    href={href}
    target={noTarget ? '' : '_blank'}
    rel="noreferrer noopener"
    className={className}
    onClick={(event) => stopClickPropagation && event.stopPropagation()}
  >
    {children}
    {noTarget ? null : <span className="pf-u-screen-reader"> (new window or tab)</span>}
    {!noIcon && <ExternalLinkAltIcon color="#0066cc" size="sm" className="pf-u-ml-sm" />}
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  noIcon: PropTypes.bool,
  noTarget: PropTypes.bool,
  className: PropTypes.string,
  stopClickPropagation: PropTypes.bool,
};

export default ExternalLink;
