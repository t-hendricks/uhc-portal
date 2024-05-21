import React from 'react';

import { Title } from '@patternfly/react-core';

import { allCategories, downloadsCategories } from './downloadsStructure';

import './DownloadsSection.scss';

type DownloadsSectionProps = {
  selectedCategory: (typeof allCategories)[number]['key'];
  category: string;
  description?: React.ReactNode;
  children?: React.ReactElement;
};

/**
 * Section with title and optional description, shown or hidden according to selectedCategory.
 */
const DownloadsSection = ({
  selectedCategory,
  category,
  description,
  children,
}: DownloadsSectionProps) =>
  ['ALL', category].includes(selectedCategory) ? (
    <>
      <div className="downloads-section-header" data-testid={`downloads-section-${category}`}>
        <Title headingLevel="h2">
          {downloadsCategories().find((c) => c.key === category)?.title}
        </Title>
        {/* Omit spacing between title & description when no description */}
        {description && <div className="description">{description}</div>}
      </div>
      {children}
    </>
  ) : null;

export default DownloadsSection;
