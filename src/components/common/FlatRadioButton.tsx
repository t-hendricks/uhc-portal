import React from 'react';
import cx from 'classnames';
import { Title } from '@patternfly/react-core';
import ButtonWithTooltip from './ButtonWithTooltip';

import './FlatRadioButton.scss';

const BASE_CLASS_NAME = 'ocm-flat-radio-button';

type Props = {
  isSelected?: boolean;
  onChange: (value: string) => void;
  secondaryText?: React.ReactNode;
  titleText: React.ReactNode;
  value: string;
  extraClass?: string;
  disableReason?: React.ReactNode;
} & React.ComponentProps<typeof ButtonWithTooltip>;

const FlatRadioButton = ({
  isSelected = false,
  disableReason = undefined,
  value = '',
  onChange,
  titleText,
  secondaryText,
  extraClass,
  ...extraProps
}: Props) => {
  const className = cx(BASE_CLASS_NAME, { selected: isSelected }, extraClass);

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
};

export default FlatRadioButton;
