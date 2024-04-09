import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  GridItem,
} from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa_v2/constants';

import { ExpandableReviewItem } from './ExpandableReviewItem';
import reviewValues from './reviewValues';

export const FormikReviewItem = (field, dependentFields = {}) => {
  const {
    values: { [field]: value, [FieldId.Hypershift]: hypershiftValue },
  } = useFormState();
  const reviewValue = reviewValues[field];
  let finalValue = value;
  const isHypershiftSelected = hypershiftValue === 'true';

  if (!reviewValue) {
    return (
      <DescriptionListGroup>
        <DescriptionListTerm>{field}</DescriptionListTerm>
        <DescriptionListDescription>{value}</DescriptionListDescription>
      </DescriptionListGroup>
    );
  }

  if (reviewValue.isOptional && !value) {
    return null;
  }

  if (reviewValue.isBoolean && value === undefined) {
    finalValue = 'false';
  }

  // For hypershift, always display 'Multi-zone' (=value to 'true')
  // even though up to this point the value was set to 'false'
  if (reviewValue.title === 'Availability' && isHypershiftSelected) {
    finalValue = 'true';
  }

  let displayValue;
  if (reviewValue.values && reviewValue.values[finalValue]) {
    displayValue = reviewValue.values[finalValue];
  } else if (reviewValue.valueTransform) {
    displayValue = reviewValue.valueTransform(finalValue, dependentFields);
  } else {
    displayValue = finalValue;
  }

  const formattedDisplayValue = reviewValue.isMonospace ? <pre>{displayValue}</pre> : displayValue;

  const description = reviewValue.isExpandable ? (
    <ExpandableReviewItem initiallyExpanded={reviewValue.initiallyExpanded}>
      {formattedDisplayValue}
    </ExpandableReviewItem>
  ) : (
    formattedDisplayValue
  );

  return (
    <DescriptionListGroup key={field}>
      <DescriptionListTerm>{reviewValue.title}</DescriptionListTerm>
      <DescriptionListDescription data-testid={reviewValue.title.replace(/ /g, '-')}>
        {description}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export const ReviewItem = ({ name, formValues }) => {
  const reviewValue = reviewValues[name];
  let value = formValues[name];
  const isHypershiftSelected = formValues.hypershift === 'true';

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

  if (reviewValue.title === 'Availability' && isHypershiftSelected) {
    value = 'true';
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
    <ExpandableReviewItem initiallyExpanded={reviewValue.initiallyExpanded}>
      {formattedDisplayValue}
    </ExpandableReviewItem>
  ) : (
    formattedDisplayValue
  );

  return (
    <DescriptionListGroup key={name}>
      <DescriptionListTerm>{reviewValue.title}</DescriptionListTerm>
      <DescriptionListDescription data-testid={reviewValue.title.replace(/ /g, '-')}>
        {description}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

const ReviewSection = ({ initiallyExpanded, title, children, onGoToStep }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  const onToggle = (_event, toggleValue) => {
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
        toggleContent={
          <div>
            <span>{title}</span>
            <Button
              variant="link"
              isInline
              className="pf-v5-u-font-size-sm pf-v5-u-ml-sm"
              onClick={(event) => {
                event.stopPropagation();
                onGoToStep();
              }}
            >
              Edit <span className="pf-v5-u-screen-reader">{title}</span> step
            </Button>
          </div>
        }
      >
        <DescriptionList isHorizontal {...listOptions}>
          {children}
        </DescriptionList>
      </ExpandableSection>
    </GridItem>
  );
};

ReviewItem.propTypes = {
  name: PropTypes.string,
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
};

ReviewSection.propTypes = {
  initiallyExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onGoToStep: PropTypes.func.isRequired,
};

export default ReviewSection;
