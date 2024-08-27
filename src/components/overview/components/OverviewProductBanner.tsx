import React from 'react';

import { Split, SplitItem, TextContent, Title } from '@patternfly/react-core';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';

import ExternalLink from '~/components/common/ExternalLink';

import './OverviewProductBanner.scss';

export type OverviewProductBannerProps = {
  title: string;
  icon?: string;
  altText?: string;
  learnMoreLink?: string;
  description: string | React.ReactNode;
  dataTestId?: string;
};

export const OverviewProductBanner = ({
  icon,
  altText,
  learnMoreLink,
  title,
  description,
  dataTestId,
}: OverviewProductBannerProps) => (
  <PageHeader>
    <Split hasGutter data-testid={dataTestId}>
      <SplitItem>
        {icon ? <img src={icon} alt={altText} className="overview-product-banner-icon" /> : null}
      </SplitItem>
      <SplitItem>
        <Title headingLevel="h1">{title}</Title>
        <TextContent>
          {description}{' '}
          {learnMoreLink ? <ExternalLink href={learnMoreLink}>Learn more</ExternalLink> : null}
        </TextContent>
      </SplitItem>
    </Split>
  </PageHeader>
);
