import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

const ExternalLink = ({ href, children, noIcon, noTarget, className, stopClickPropagation }) => {
  const track = useAnalytics();

  const trackExternalLink = () => {
    const currentUrl = window.location.href;
    const moduleValue = 'openshift';

    let resource;
    switch (true) {
      case currentUrl.includes('/rosa'):
        resource = 'moa';
        break;
      case currentUrl.includes('/osdtrial'):
        resource = 'osdtrial';
        break;
      case currentUrl.includes('/osd'):
        resource = 'osd';
        break;
      default:
        resource = 'all';
        break;
    }

    track(trackEvents.ExternalLink, {
      customProperties: JSON.parse(
        `{
          "link_url":"${href}",
          "module":"${moduleValue}",
          "ocm_resource_type":"${resource}"
        }`,
      ),
    });
  };

  return (
    <a
      href={href}
      target={noTarget ? '' : '_blank'}
      rel="noreferrer noopener"
      className={className}
      onClick={(event) => {
        stopClickPropagation && event.stopPropagation();
        trackExternalLink();
      }}
    >
      {children}
      {noTarget ? null : <span className="pf-u-screen-reader"> (new window or tab)</span>}
      {!noIcon && <ExternalLinkAltIcon color="#0066cc" size="sm" className="pf-u-ml-sm" />}
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  noIcon: PropTypes.bool,
  noTarget: PropTypes.bool,
  className: PropTypes.string,
  stopClickPropagation: PropTypes.bool,
};

export default ExternalLink;
