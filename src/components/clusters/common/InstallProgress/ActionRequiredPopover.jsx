import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import ActionRequiredModal from './ActionRequiredModal';

function ActionRequiredPopover({ cluster, icon }) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const reviewOptions = () => {
    setPopoverOpen(false);
    setModalOpen(true);
  };
  return (
    <>
      <Popover
        headerContent="Action required: Create operator roles and OIDC provider"
        bodyContent={(
          <div>
            Your cluster will proceed to ready state only after the operator
            roles and OIDC provider are created.
          </div>
        )}
        footerContent={(
          <Button variant="link" isInline onClick={reviewOptions}>
            Review your options
          </Button>
        )}
        position="right"
        isVisible={popoverOpen}
        shouldOpen={() => setPopoverOpen(true)}
        shouldClose={() => setPopoverOpen(false)}
      >
        <Button variant="link" isInline icon={icon}>
          Installation waiting
        </Button>
      </Popover>
      <ActionRequiredModal
        cluster={cluster}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

ActionRequiredPopover.propTypes = {
  cluster: PropTypes.object.isRequired,
  icon: PropTypes.node,
};

export default ActionRequiredPopover;
