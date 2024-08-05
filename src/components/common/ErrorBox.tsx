import React from 'react';

import { Alert, AlertActionCloseButton, ExpandableSection } from '@patternfly/react-core';

import ErrorDetailsDisplay from '~/components/common/ErrorDetailsDisplay';
import { ErrorState } from '~/types/types';

type Props = {
  message: string;
  response: Pick<ErrorState, 'errorDetails' | 'errorMessage' | 'operationID'>;
  variant?: 'danger' | 'warning';
  children?: React.ReactNode;
  isExpandable?: boolean;
  showCloseBtn?: boolean;
  onCloseAlert?: () => void;
  hideOperationID?: boolean;
  forceAsAlert?: boolean;
};

const ErrorBox = ({
  message,
  variant = 'danger',
  response,
  children,
  isExpandable,
  showCloseBtn = false,
  onCloseAlert,
  hideOperationID,
  forceAsAlert,
}: Props) => {
  const closeAlertProp = {
    actionClose: <AlertActionCloseButton onClose={onCloseAlert} />,
  };
  return (
    <Alert
      variant={variant}
      isInline
      title={message}
      role={variant === 'danger' || forceAsAlert ? 'alert' : undefined}
      className="error-box"
      data-testid="alert-error"
      {...(showCloseBtn && closeAlertProp)}
    >
      {children && (
        <>
          {children}
          <br />
        </>
      )}
      {isExpandable || children ? (
        <ExpandableSection toggleText={children ? 'More details' : 'Error details'}>
          <ErrorDetailsDisplay response={response} hideOperationID={hideOperationID} />
        </ExpandableSection>
      ) : (
        <ErrorDetailsDisplay response={response} />
      )}
    </Alert>
  );
};

export default ErrorBox;
