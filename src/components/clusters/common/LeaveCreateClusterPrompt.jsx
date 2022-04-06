import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

function LeaveCreateClusterPrompt({ when }) {
  const history = useHistory();
  const unblockHistory = () => history.block(() => {});

  const [isOpen, setIsOpen] = React.useState(false);
  const [destinationPath, setDestinationPath] = React.useState('');

  React.useEffect(() => {
    if (when && !isOpen) {
      // Open the prompt and capture the destination path meant to navigate to so that
      // if the user decides to leave, we send them to the intended route.
      history.block((prompt) => {
        setDestinationPath(prompt.pathname);
        setIsOpen(true);
        return 'true';
      });
    } else {
      unblockHistory();
    }

    return () => {
      unblockHistory();
    };
  }, [history, isOpen, when]);

  return isOpen ? (
    <Modal
      variant={ModalVariant.small}
      title="Leave create cluster?"
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      actions={[
        <Button
          key="leave"
          variant="primary"
          onClick={() => history.push(destinationPath)}
        >
          Yes, leave
        </Button>,
        <Button
          key="stay"
          variant="link"
          onClick={() => setIsOpen(false)}
        >
          No, stay
        </Button>,
      ]}
    >
      All data entered will be lost
    </Modal>
  ) : null;
}

LeaveCreateClusterPrompt.propTypes = {
  /* Used to control when nav away prompt is shown. */
  when: PropTypes.bool,
};

export default LeaveCreateClusterPrompt;
