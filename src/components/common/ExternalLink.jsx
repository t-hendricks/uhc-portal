import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

const ExternalLink = ({
  href,
  children,
  noIcon,
  noTarget,
  className,
  stopClickPropagation,
  isButton,
  variant,
}) => {
  const track = useAnalytics();

  const trackExternalLink = () => {
    const path = window.location.pathname;
    let resource;
    if (path.includes('/rosa')) {
      resource = 'moa';
    } else if (path.includes('/osdtrial')) {
      resource = 'osdtrial';
    } else if (path.includes('/osd')) {
      resource = 'osd';
    } else if (path.includes('/crc')) {
      resource = 'crc';
    } else {
      resource = 'all';
    }

    track(trackEvents.ExternalLink, {
      customProperties: {
        link_url: href,
        module: 'openshift',
        ocm_resource_type: resource,
      },
    });
  };

  const handleClick = (event) => {
    if (stopClickPropagation) {
      trackExternalLink();
      event.stopPropagation();
    } else {
      trackExternalLink();
    }
  };

  const linkProps = {
    href,
    target: noTarget ? '' : '_blank',
    rel: 'noreferrer noopener',
    className,
    onClick: handleClick,
  };

  const childrenComp = (
    <>
      {children}
      {noTarget ? null : <span className="pf-u-screen-reader"> (new window or tab)</span>}
      {!noIcon && <ExternalLinkAltIcon color="#0066cc" size="sm" className="pf-u-ml-sm" />}
    </>
  );
  return isButton ? (
    <Button component="a" {...linkProps} variant={variant}>
      {childrenComp}
    </Button>
  ) : (
    <a {...linkProps}>{childrenComp}</a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  noIcon: PropTypes.bool,
  noTarget: PropTypes.bool,
  className: PropTypes.string,
  stopClickPropagation: PropTypes.bool,
  isButton: PropTypes.bool,
  variant: PropTypes.string,
};

ExternalLink.defaultProps = {
  isButton: false,
  variant: ButtonVariant.secondary,
};

export default ExternalLink;
