import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';

import './InstructionCommand.scss';

const InstructionCommand = ({ children, textAriaLabel, trackEvent }) => {
  const { track } = useAnalytics();
  return (
    <Text component="pre" className="ocm-instructions__command">
      <ClipboardCopy
        isReadOnly
        textAriaLabel={textAriaLabel}
        onCopy={trackEvent ? (event, text) => {
          track(trackEvent);
          clipboardCopyFunc(event, text);
        } : undefined}
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
};

export default InstructionCommand;
