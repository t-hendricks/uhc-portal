import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  GridItem,
  Spinner,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import reviewValues from './reviewValues';
import { ExpandableReviewItem } from './ExpandableReviewItem';
import { BackToAssociateAwsAccountLink } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/common/BackToAssociateAwsAccountLink';
import PopoverHintWithTitle from '~/components/common/PopoverHintWithTitle';

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
    <ExpandableReviewItem initiallyExpanded={reviewValue.initiallyExpanded}>
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

export const ReviewRoleItem = ({ name, getRoleResponse, content }) => (
  <DescriptionListGroup key={name}>
    <DescriptionListTerm>{name} ARN</DescriptionListTerm>
    <DescriptionListDescription>
      {getRoleResponse?.pending && (
        <div className="spinner-fit-container">
          <Spinner size="md" />
        </div>
      )}
      {(getRoleResponse?.error || (!content && getRoleResponse?.fulfilled)) && (
        <PopoverHintWithTitle
          isErrorHint
          title={`${name} could not be detected`}
          bodyContent={
            <>
              <TextContent>
                <Text component={TextVariants.p}>
                  <span className="danger">
                    <ExclamationCircleIcon className="status-icon danger" />
                    <strong>{`${name} is no longer linked to your Red Hat organization.`}</strong>
                  </span>
                </Text>
                <Text component={TextVariants.p}>
                  <p>
                    Follow the AWS account association instructions and try again
                  </p>
                </Text>
              </TextContent>
            </>
          }
          footer={
            <BackToAssociateAwsAccountLink />
          }
          iconClassName="hand-pointer"
          />
      )}
      {getRoleResponse?.fulfilled ? content : null}
    </DescriptionListDescription>
  </DescriptionListGroup>
)

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

ReviewRoleItem.propTypes = {
  name: PropTypes.string,
  getRoleResponse: PropTypes.object,
  content: PropTypes.string,
};

ReviewSection.propTypes = {
  initiallyExpanded: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default ReviewSection;
