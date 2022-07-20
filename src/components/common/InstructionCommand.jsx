import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy, clipboardCopyFunc, Text } from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';
import { getTrackEvent } from '~/common/helpers';
import './InstructionCommand.scss';

const InstructionCommand = ({ children, textAriaLabel, trackEventsKey }) => {
  const { analytics } = useChrome();
  return (
    <Text component="pre" className="ocm-instructions__command">
      <ClipboardCopy
        isReadOnly
        textAriaLabel={textAriaLabel}
        onCopy={(event, text) => {
          if (trackEventsKey) {
            const eventObj = getTrackEvent(trackEventsKey);
            analytics.track(eventObj.event, eventObj.properties);
          }
          clipboardCopyFunc(event, text);
        }}
      >
        {children}
      </ClipboardCopy>
    </Text>
  );
};

InstructionCommand.propTypes = {
  children: PropTypes.node,
  textAriaLabel: PropTypes.string,
  trackEventsKey: PropTypes.string,
};

export default InstructionCommand;
