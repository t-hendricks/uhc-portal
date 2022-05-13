import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const ExternalLink = ({
  href,
  children,
  noIcon,
  noTarget,
  className,
}) => {
  let target = '_blank';
  if (noTarget) {
    target = '';
  }
  return (
    <a href={href} target={target} rel="noreferrer noopener" className={className}>
      {children}
      {!noIcon && (
        <>
          {' '}
          <ExternalLinkAltIcon color="#0066cc" size="sm" />
        </>
      )}
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  noIcon: PropTypes.bool,
  noTarget: PropTypes.bool,
  className: PropTypes.string,
};

export default ExternalLink;
