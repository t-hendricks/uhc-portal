import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';

import './DownloadsSection.scss';

import { downloadsCategories } from './downloadsStructure';

/**
 * Section with title and optional description, shown or hidden according to selectedCategory.
 */
const DownloadsSection = ({ selectedCategory, category, description, children }) =>
  (selectedCategory === 'ALL' || selectedCategory === category) && (
    <>
      <div className="downloads-section-header" data-testid={`downloads-section-${category}`}>
        <Title headingLevel="h2">{downloadsCategories.find((c) => c.key === category).title}</Title>
        {/* Omit spacing between title & description when no description */}
        {description && <div className="description">{description}</div>}
      </div>
      {children}
    </>
  );
DownloadsSection.propTypes = {
  selectedCategory: PropTypes.oneOf(downloadsCategories.map((c) => c.key)).isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.node,
  children: PropTypes.node,
};

export default DownloadsSection;
