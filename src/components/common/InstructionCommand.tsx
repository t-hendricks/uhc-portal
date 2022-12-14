import React from 'react';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';
import { TrackEvent } from '~/common/analytics';

import './InstructionCommand.scss';

type Props = {
  children?: React.ReactNode;
  textAriaLabel?: string;
  trackEvent?: TrackEvent;
  className?: string;
  outerClassName?: string;
};

const InstructionCommand = ({
  children,
  textAriaLabel,
  trackEvent,
  className,
  outerClassName,
}: Props) => {
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

export default InstructionCommand;
