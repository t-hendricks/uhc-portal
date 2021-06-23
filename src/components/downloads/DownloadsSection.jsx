import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
} from '@patternfly/react-core';

import './DownloadsSection.scss';

import { downloadsCategoryTitles } from './DownloadsCategoryDropdown';

/**
 * Section with title and optional description, shown or hidden according to selectedCategory.
 */
const DownloadsSection = ({
  selectedCategory, category, description, children,
}) => (
  (selectedCategory === 'ALL' || selectedCategory === category) && (
  <>
    <div className="downloads-section-header">
      <Title headingLevel="h2">
        {downloadsCategoryTitles[category]}
      </Title>
      {/* Omit spacing between title & description when no description */}
      {description && (
      <div className="description">
        {description}
      </div>
      )}
    </div>
    {children}
  </>
  )
);
DownloadsSection.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.node,
  children: PropTypes.node,
};

export default DownloadsSection;
