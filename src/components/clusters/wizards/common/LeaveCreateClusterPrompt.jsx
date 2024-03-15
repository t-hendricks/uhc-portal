import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

import { trackEvents, ocmResourceTypeByProduct } from '~/common/analytics';
import { normalizedProducts } from '~/common/subscriptionTypes';
import useAnalytics from '~/hooks/useAnalytics';

function LeaveCreateClusterPrompt({ product, forceLeaveWizard }) {
  const history = useHistory();
  const track = useAnalytics();

  const [isOpen, setIsOpen] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState('');

  const onLeave = useCallback(() => {
    track(trackEvents.WizardLeave, {
      resourceType: ocmResourceTypeByProduct[product],
    });
    history.push(destinationLocation);
    setIsOpen(false);
  }, [product, destinationLocation, history, track]);

  useEffect(() => {
    let unblock;

    if (!isOpen) {
      // Open the prompt and capture the destination path meant to navigate to so that
      // if the user decides to leave, we send them to the intended route.
      unblock = history.block((location, action) => {
        // Return to the original URL within the browser history.
        if (action === 'POP') {
          window.history.forward();
        }

        setDestinationLocation(location);
        setIsOpen(true);
        return 'true';
      });
    } else {
      unblock?.();
    }

    return () => {
      unblock?.();
    };
  }, [history, isOpen]);

  useEffect(() => {
    if (forceLeaveWizard) {
      onLeave();
    }
  }, [forceLeaveWizard, onLeave]);

  return isOpen && !forceLeaveWizard ? (
    <Modal
      variant={ModalVariant.small}
      title="Leave cluster creation"
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      actions={[
        <Button
          key="leave"
          variant="primary"
          onClick={onLeave}
          data-testid="leave-cluster-prompt-button"
        >
          Leave
        </Button>,
        <Button
          key="stay"
          variant="link"
          onClick={() => setIsOpen(false)}
          data-testid="cancel-button"
        >
          Stay
        </Button>,
      ]}
      data-testid="leave-cluster-modal"
    >
      All data entered will be lost.
    </Modal>
  ) : null;
}

LeaveCreateClusterPrompt.propTypes = {
  product: PropTypes.oneOf(Object.values(normalizedProducts)),
  forceLeaveWizard: PropTypes.bool,
};

export default LeaveCreateClusterPrompt;
