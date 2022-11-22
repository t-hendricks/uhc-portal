import React from 'react';

import { Button } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  SpinnerIcon,
} from '@patternfly/react-icons';

import './ValidationIconButton.scss';

interface ValidationIconButtonProps {
  isValid: boolean;
  isValidating: boolean;
  touched: boolean;
  onClick(): void;
}

export const ValidationIconButton = ({
  isValid,
  isValidating,
  touched,
  onClick,
}: ValidationIconButtonProps) => {
  let icon = <InfoCircleIcon className="validation-icon_info" />;
  let label = 'Validation rules';
  let className = 'validation-icon-button_info';

  if (touched) {
    if (isValidating) {
      icon = <SpinnerIcon className="validation-icon_info" />;
      label = 'Validation in progress';
    } else if (isValid) {
      icon = <CheckCircleIcon className="validation-icon_success" />;
      label = 'All validation rules met';
      className = 'validation-icon-button_valid';
    } else {
      icon = <ExclamationCircleIcon className="validation-icon_danger" />;
      label = 'Not all validation rules met';
      className = 'validation-icon-button_not-valid';
    }
  }

  return (
    <Button
      variant="control"
      aria-label={label}
      tabIndex={-1}
      className={`${className} validation-icon-button`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};
