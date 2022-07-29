import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';
import { getTrackEvent } from '~/common/analytics';
import './InstructionCommand.scss';

const InstructionCommand = ({ children, textAriaLabel, trackEvent }) => {
  const { analytics } = useChrome();
  return (
    <Text component="pre" className="ocm-instructions__command">
      <ClipboardCopy
        isReadOnly
        textAriaLabel={textAriaLabel}
        onCopy={trackEvent ? (event, text) => {
          const eventObj = getTrackEvent(trackEvent);
          analytics.track(eventObj.event, eventObj.properties);
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
