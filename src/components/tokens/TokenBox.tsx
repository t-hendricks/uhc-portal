import React from 'react';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Alert, Skeleton } from '@patternfly/react-core';
import InstructionCommand from '../common/InstructionCommand';
import RevokeTokensInstructions from './RevokeTokensInstructions';

type Props = {
  token?: string;
  command?: string;
  showCommandOnError?: boolean;
  showInstructionsOnError?: boolean;
} & Partial<React.ComponentProps<typeof InstructionCommand>>;

const InvalidGrant = 'invalid_grant';

/**
 * Generates a box for containing the value of a token.
 */
const TokenBox = ({
  token,
  command = '{{TOKEN}}',
  showCommandOnError = false,
  showInstructionsOnError = true,
  textAriaLabel = 'Copyable token',
  className = 'ocm-c-api-token-limit-width',
  ...props
}: Props) => {
  if (!token) {
    return (
      <div className="pf-u-mt-md">
        <div className="pf-u-mb-xs">
          <Spinner className="progressing-icon" />
          <span>Loading token, this might take a minute</span>
        </div>
        <Skeleton fontSize="md" />
      </div>
    );
  }
  const instructionCommand = (
    <InstructionCommand
      className={className}
      textAriaLabel={textAriaLabel}
      outerClassName="pf-u-mt-md"
      {...props}
    >
      {command.replace('{{TOKEN}}', token === InvalidGrant ? '' : token)}
    </InstructionCommand>
  );
  if (token === InvalidGrant) {
    return (
      <>
        {showCommandOnError && instructionCommand}
        {showInstructionsOnError && (
          <Alert
            variant="warning"
            isInline
            className="pf-u-mt-md"
            id="invalid_grant-message"
            title="Could not grant an offline token"
          >
            <RevokeTokensInstructions reason="You might have exceeded the maximum number of offline sessions." />
          </Alert>
        )}
      </>
    );
  }
  return instructionCommand;
};

export default TokenBox;
