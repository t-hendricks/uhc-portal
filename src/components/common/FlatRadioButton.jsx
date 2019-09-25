import React from 'react';
import {
  Button, Split, SplitItem, Title, Tooltip,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const BASE_CLASS_NAME = 'ocm-flat-radio-button';

function FlatRadioButton({
  isDisabled = false,
  isSelected = false,
  tooltip = undefined,
  value = '',
  onChange,
  titleText,
  secondaryText,
  icon,
  ...extraProps
}) {
  const extraClass = isSelected ? ' selected' : '';
  const className = `${BASE_CLASS_NAME}${extraClass}`;

  const onClick = () => {
    onChange(value);
  };

  const button = (
    <Button
      isDisabled={isDisabled}
      onClick={onClick}
      className={className}
      variant="tertiary"
      {...extraProps}
    >
      <Split gutter="sm">
        {icon && (
          <SplitItem className="ocm-flat-button-icon">
            {icon}
          </SplitItem>
        )}
        <SplitItem isFilled>
          <Title headingLevel="h4" size="lg">{titleText}</Title>
          {secondaryText && secondaryText}
        </SplitItem>
      </Split>
    </Button>
  );

  if (!tooltip) {
    return button;
  }
  return (
    <Tooltip content={tooltip}>
      <div>
        {/* we have to have a div here since disabled buttons
        don't react to pointer events, and thus can't have tooltips */}
        {button}
      </div>
    </Tooltip>
  );
}

FlatRadioButton.propTypes = {
  icon: PropTypes.node,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  secondaryText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  titleText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
};

export default FlatRadioButton;
