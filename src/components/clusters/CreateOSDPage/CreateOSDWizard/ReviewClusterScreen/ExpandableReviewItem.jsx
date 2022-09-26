import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExpandableSection } from '@patternfly/react-core';

export const ExpandableReviewItem = ({ children, initiallyExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const onToggle = (toggleValue) => {
    setIsExpanded(toggleValue);
  };

  return (
    <ExpandableSection
      className="review-screen-item-expandable-section"
      isExpanded={isExpanded}
      onToggle={onToggle}
      toggleText={isExpanded ? 'Show less' : 'Show more'}
    >
      {children}
    </ExpandableSection>
  );
};

ExpandableReviewItem.propTypes = {
  initiallyExpanded: PropTypes.bool,
  children: PropTypes.node,
};

export default ExpandableReviewItem;
