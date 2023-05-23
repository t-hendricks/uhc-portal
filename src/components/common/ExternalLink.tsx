import React from 'react';
import { Button, ButtonProps, ButtonVariant } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

type Props = {
  href: string;
  children?: React.ReactNode;
  noIcon?: boolean;
  noTarget?: boolean;
  className?: string;
  stopClickPropagation?: boolean;
  isButton?: boolean;
  variant?: ButtonProps['variant'];
};

const ExternalLink = ({
  href,
  children,
  noIcon,
  noTarget,
  className,
  stopClickPropagation,
  isButton,
  variant = ButtonVariant.secondary,
}: Props) => {
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

  const handleClick: React.MouseEventHandler = (event) => {
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
      {!noIcon && (
        <ExternalLinkAltIcon
          color="#0066cc"
          size="sm"
          className="pf-u-ml-sm"
          data-testid="openInNewWindowIcon"
        />
      )}
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

export default ExternalLink;
