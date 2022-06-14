import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

function LeaveCreateClusterPrompt({ when = true }) {
  const history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);
  const [destinationLocation, setDestinationLocation] = React.useState('');

  React.useEffect(() => {
    let unblock;

    if (when && !isOpen) {
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
  }, [history, isOpen, when]);

  const onLeave = () => {
    history.push(destinationLocation);
    setIsOpen(false);
  };

  return isOpen ? (
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
          data-testid="submit-button"
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
  /* Used to control when nav away prompt is shown. */
  when: PropTypes.bool,
};

export default LeaveCreateClusterPrompt;
