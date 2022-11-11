import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

const ExternalLink = ({ href, children, noIcon, noTarget, className }: ExternalLinkProps) => {
  const track = useAnalytics();

  const currentUrl = window.location.href;
  const moduleValue = 'openshift';

  const resourceType = () => {
    if (currentUrl.includes('/rosa')) {
      return 'moa';
    } else if (currentUrl.includes('/osdtrial')) {
      return 'osdtrial';
    } else if (currentUrl.includes('/osd')) {
      return 'osd';
    } else if (currentUrl.includes('/crc')) {
      return 'crc';
    } else {
      return 'all';
    }
  };

  const trackExternalLink = () => {
    track(trackEvents.ExternalLink, {
      customProperties: JSON.parse(
        `{
          "link_url":"${href}", 
          "module":"${moduleValue}", 
          "ocm_resource_type":"${resourceType()}"
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
      onClick={trackExternalLink}
    >
      {children}
      {noTarget ? null : <span className="pf-u-screen-reader"> (new window or tab)</span>}
      {!noIcon && <ExternalLinkAltIcon color="#0066cc" size="sm" className="pf-u-ml-sm" />}
    </a>
  );
};

interface ExternalLinkProps {
  href: string;
  children?: React.ReactNode;
  noIcon?: boolean;
  noTarget?: boolean;
  className?: string;
}

export default ExternalLink;
