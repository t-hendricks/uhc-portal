import './marketing-banner.scss';

import { PageSection } from '@patternfly/react-core';
import React from 'react';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  graphicRight?: boolean;
  hasGraphic?: boolean;
  dark1000?: boolean;
  fullBleed?: boolean;
  isWidthLimited?: boolean;
};

const MarketingBanner = ({
  className,
  hasGraphic,
  graphicRight,
  dark1000,
  fullBleed,
  style,
  children,
  isWidthLimited,
}: Props) => {
  const MarketingBannerSectionClasses = classNames(
    className,
    'ocm-c-marketing-banner',
    { 'ocm-m-with-graphic': hasGraphic },
    { 'ocm-m-graphic-right': graphicRight },
    { 'ocm-m-dark-1000 pf-m-dark-1000': dark1000 },
    { 'ocm-m-full-bleed': fullBleed },
  );

  return (
    <PageSection
      className={MarketingBannerSectionClasses}
      style={style}
      isWidthLimited={isWidthLimited}
    >
      {children}
    </PageSection>
  );
};

export default MarketingBanner;
