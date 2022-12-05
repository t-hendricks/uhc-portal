import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';

import './InstructionCommand.scss';

const InstructionCommand = ({ children, textAriaLabel, trackEvent, className, outerClassName }) => {
  const track = useAnalytics();
  return (
    <Text component="pre" className={outerClassName}>
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
  outerClassName: PropTypes.string,
};

export default InstructionCommand;
