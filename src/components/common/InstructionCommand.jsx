import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';

import './InstructionCommand.scss';

const InstructionCommand = ({
  children,
  textAriaLabel,
  trackEvent,
  className,
  limitWidth = true,
}) => {
  const track = useAnalytics();
  return (
    <Text component="pre" className={limitWidth ? 'ocm-instructions__command' : ''}>
      <ClipboardCopy
        isReadOnly
        textAriaLabel={textAriaLabel}
        onCopy={(event, text) => {
          if (trackEvent) {
            track(trackEvent);
          }
          clipboardCopyFunc(event, text);
        }}
        className={className}
      >
        {children}
      </ClipboardCopy>
    </Text>
  );
};

InstructionCommand.propTypes = {
  children: PropTypes.node,
  textAriaLabel: PropTypes.string,
  trackEvent: PropTypes.object,
  className: PropTypes.string,
  limitWidth: PropTypes.bool,
};

export default InstructionCommand;
