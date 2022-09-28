import React from 'react';
import cx from 'classnames';
import { Title } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import './FlatRadioButton.scss';
import ButtonWithTooltip from './ButtonWithTooltip';

const BASE_CLASS_NAME = 'ocm-flat-radio-button';

function FlatRadioButton({
  isSelected = false,
  disableReason = undefined,
  value = '',
  onChange,
  titleText,
  secondaryText,
  extraClass,
  ...extraProps
}) {
  const isSelectedClass = isSelected ? 'selected' : '';
  const className = cx(BASE_CLASS_NAME, isSelectedClass, extraClass);

  const onClick = () => {
    onChange(value);
  };

  return (
    <ButtonWithTooltip
      disableReason={disableReason}
      onClick={onClick}
      className={className}
      variant="tertiary"
      {...extraProps}
    >
      <Title headingLevel="h4" size="lg">
        {titleText}
      </Title>
      {secondaryText && secondaryText}
    </ButtonWithTooltip>
  );
}

FlatRadioButton.propTypes = {
  isSelected: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  secondaryText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  titleText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  disableReason: PropTypes.node,
};

export default FlatRadioButton;
