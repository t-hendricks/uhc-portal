import React from 'react';
import { Alert, ExpandableSection, AlertActionCloseButton } from '@patternfly/react-core';
import { ErrorState } from '~/types/types';
import { formatErrorDetails } from '../../common/errors';

type Props<R extends Response = Response> = {
  message: string;
  response: ErrorState;
  variant?: 'danger' | 'warning';
  children?: React.ReactNode;
  isExpandable?: boolean;
  showCloseBtn?: boolean;
  onCloseAlert?: () => void;
};

const ErrorBox = ({
  message,
  variant = 'danger',
  response,
  children,
  isExpandable,
  showCloseBtn = false,
  onCloseAlert,
}: Props) => {
  const errorDetails = formatErrorDetails(response.errorDetails);
  const detailsDisplay = (
    <>
      {response.errorMessage && <span>{response.errorMessage}</span>}
      {errorDetails}
      <br />
      <span>{`Operation ID: ${response.operationID || 'N/A'}`}</span>
    </>
  );
  const closeAlertProp = {
    actionClose: <AlertActionCloseButton onClose={onCloseAlert} />,
  };
  return (
    <Alert
      variant={variant}
      isInline
      title={message}
      role={variant === 'danger' ? 'alert' : undefined}
      className="error-box"
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
          {detailsDisplay}
        </ExpandableSection>
      ) : (
        detailsDisplay
      )}
    </Alert>
  );
};

export default ErrorBox;
