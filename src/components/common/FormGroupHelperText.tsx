import React from 'react';

import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  HelperTextItemProps,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

interface FormGroupHelperTextProps {
  children?: React.ReactNode;
  id?: string;
  error?: string | undefined;
  touched?: boolean;
  variant?: HelperTextItemProps['variant'];
  icon?: React.ReactNode;
}

export const FormGroupHelperText = ({
  children,
  id,
  error,
  touched,
  variant = 'default',
  icon,
}: FormGroupHelperTextProps) => {
  const helpMessage = React.useMemo(() => {
    if (typeof children === 'string') {
      return (
        <HelperText id={id}>
          <HelperTextItem icon={icon} variant={variant}>
            {children}
          </HelperTextItem>
        </HelperText>
      );
    }

    return <HelperText>{children}</HelperText>;
  }, [children, id, icon, variant]);

  if (!error && !children) {
    return null;
  }

  return (
    <FormHelperText>
      {touched && error ? (
        <HelperText id={id}>
          <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
            {error}
          </HelperTextItem>
        </HelperText>
      ) : (
        helpMessage
      )}
    </FormHelperText>
  );
};
