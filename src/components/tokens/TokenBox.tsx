import React from 'react';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { Skeleton } from '@patternfly/react-core';
import InstructionCommand from '../common/InstructionCommand';

type Props = {
  token?: string | Error;
  command?: string;
} & Partial<React.ComponentProps<typeof InstructionCommand>>;

/**
 * Generates a box for containing the value of a token.
 */
const TokenBox = ({
  token,
  command = '',
  textAriaLabel = 'Copyable token',
  className = 'ocm-c-api-token-limit-width',
  limitWidth = true,
  ...props
}: Props) =>
  token == null ? (
    <>
      <div className="pf-u-mb-xs">
        <Spinner className="progressing-icon" />
        <span>Loading token, this might take a minute</span>
      </div>
      <Skeleton fontSize="md" />
    </>
  ) : (
    <InstructionCommand
      className={className}
      textAriaLabel={textAriaLabel}
      limitWidth={limitWidth}
      {...props}
    >
      {command || token}
    </InstructionCommand>
  );

export default TokenBox;
