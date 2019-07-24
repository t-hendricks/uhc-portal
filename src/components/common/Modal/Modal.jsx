import React from 'react';
import PropTypes from 'prop-types';
// import { Modal as PfModal, Button, Icon } from 'patternfly-react';
import { Modal as PfModal, Button } from '@patternfly/react-core';

import { noop } from '../../../common/helpers';

function Modal({
  title,
  onClose,
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  isSmall = true,
  children,
  ...extraProps
}) {
  return (
    <PfModal
      // For a medium size modal use isSmall=false and isLarge=true.
      // For a full screen modal use isSmall=false.
      isSmall={isSmall}
      title={title}
      isOpen
      onClose={onClose}
      actions={[
        <Button key="cancel" variant="secondary" onClick={onSecondaryClick}>
          {secondaryText}
        </Button>,
        <Button key="confirm" variant="primary" onClick={onPrimaryClick} type="submit">
          {primaryText}
        </Button>,
      ]}
      {...extraProps}
    >
      {children}
    </PfModal>);
}

Modal.propTypes = {
  isSmall: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  children: PropTypes.node,
};

Modal.defaultProps = {
  isSmall: true,
  title: '',
  onClose: noop,
  primaryText: 'Confirm',
  secondaryText: 'Cancle',
  onPrimaryClick: noop,
  onSecondaryClick: noop,
  children: null,
};

export default Modal;
