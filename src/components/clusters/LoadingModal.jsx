import React from 'react';
import { Modal } from 'patternfly-react';

import PropTypes from 'prop-types';

function LoadingModal({ children }) {
  return (
    <Modal bsSize="lg" backdrop={false} show animation={false}>
      <Modal.Body>
        <div className="spinner spinner-xl" />
        <div className="text-center">
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
}

LoadingModal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoadingModal;
