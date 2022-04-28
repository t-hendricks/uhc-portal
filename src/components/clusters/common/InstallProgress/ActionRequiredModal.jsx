import React from 'react';
import PropTypes from 'prop-types';
import {
  ClipboardCopy,
  Modal,
  ModalVariant,
  TextContent,
} from '@patternfly/react-core';

function ActionRequiredModal({ cluster, isOpen, onClose }) {
  return (
    <Modal
      title="Action required to continue installation"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.medium}
    >
      <TextContent>
        <p>
          You must create the
          {' '}
          <b>operator roles</b>
          {' '}
          and
          {' '}
          <b>OIDC provider</b>
          {' '}
          to complete cluster installation.
        </p>
        {/* TODO: Add Cloudformation and Download .zip tabs */}
        <p>Copy and run the following commands:</p>
        <p>
          <ClipboardCopy isReadOnly>
            {`rosa create operatorroles --mode manual -c ${cluster.name}`}
          </ClipboardCopy>
        </p>
        <p>
          <ClipboardCopy isReadOnly>
            {`rosa create oidcprovider --mode manual -c ${cluster.name}`}
          </ClipboardCopy>
        </p>
        <p>
          The options above will be available until the operator roles and OIDC
          provider are detected.
        </p>
      </TextContent>
    </Modal>
  );
}

ActionRequiredModal.propTypes = {
  cluster: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActionRequiredModal;
