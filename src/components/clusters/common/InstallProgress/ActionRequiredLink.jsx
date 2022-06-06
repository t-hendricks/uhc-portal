import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import ActionRequiredModal from './ActionRequiredModal';

function ActionRequiredLink({ cluster, icon, initiallyOpen }) {
  const [modalOpen, setModalOpen] = React.useState(initiallyOpen);
  return (
    <>
      <Button variant="link" isInline onClick={() => setModalOpen(true)} icon={icon}>
        Action required
      </Button>
      <ActionRequiredModal
        cluster={cluster}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

ActionRequiredLink.propTypes = {
  cluster: PropTypes.object.isRequired,
  initiallyOpen: PropTypes.bool,
  icon: PropTypes.node,
};

export default ActionRequiredLink;
