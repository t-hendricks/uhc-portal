import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  GridItem,
} from '@patternfly/react-core';
import reviewValues from './reviewValues';
import { ExpandableReviewItem } from './ExpandableReviewItem';

export const ReviewItem = ({ name, formValues }) => {
  const reviewValue = reviewValues[name];
  let value = formValues[name];

  if (!reviewValue) {
    return (
      <DescriptionListGroup>
        <DescriptionListTerm>{name}</DescriptionListTerm>
        <DescriptionListDescription>{value}</DescriptionListDescription>
      </DescriptionListGroup>
    );
  }

  if (reviewValue.isOptional && !value) {
    return null;
  }

  if (reviewValue.isBoolean && value === undefined) {
    value = 'false';
  }

  let displayValue;
  if (reviewValue.values && reviewValue.values[value]) {
    displayValue = reviewValue.values[value];
  } else if (reviewValue.valueTransform) {
    displayValue = reviewValue.valueTransform(value, formValues);
  } else {
    displayValue = value;
  }

  const formattedDisplayValue = reviewValue.isMonospace ? <pre>{displayValue}</pre> : displayValue;

  const description = reviewValue.isExpandable ? (
    <ExpandableReviewItem
      initiallyExpanded={reviewValue.initiallyExpanded}
    >
      {formattedDisplayValue}
    </ExpandableReviewItem>
  ) : (
    formattedDisplayValue
  );

  return (
    <DescriptionListGroup key={name}>
      <DescriptionListTerm>{reviewValue.title}</DescriptionListTerm>
      <DescriptionListDescription>{description}</DescriptionListDescription>
    </DescriptionListGroup>
  );
};

function ReviewSection({ initiallyExpanded, title, children = null }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const onToggle = (toggleValue) => {
    setIsExpanded(toggleValue);
  };

  const listOptions = {
    // default vertical good for narrow screens, horizontal clearer when we have the space.
    orientation: {
      sm: 'horizontal',
    },
  };

  return (
    <GridItem>
      <ExpandableSection
        className="review-screen-expandable-section"
        isExpanded={isExpanded}
        onToggle={onToggle}
        toggleText={title}
      >
        <DescriptionList isHorizontal {...listOptions}>
          {children}
        </DescriptionList>
      </ExpandableSection>
    </GridItem>
  );
}

ReviewItem.propTypes = {
  name: PropTypes.string,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
};

ReviewSection.propTypes = {
  initiallyExpanded: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default ReviewSection;
