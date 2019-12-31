import React from 'react';
import PropTypes from 'prop-types';

import { Modal as PfModal, Button } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import { noop } from '../../../common/helpers';

function Modal({
  title = '',
  onClose = noop,
  primaryText = 'Confirm',
  showSecondery = true,
  secondaryText = 'Cancel',
  onPrimaryClick = noop,
  onSecondaryClick = noop,
  isSmall = true,
  isPrimaryDisabled = false,
  isPending = false,
  children = null,
  primaryVariant = 'primary',
  ...extraProps
}) {
  return (
    <PfModal
        // For a medium size modal use isSmall=false and isLarge=true.
        // For a full screen modal use isSmall=false.
      className={isPending ? 'pending-modal' : null}
      isSmall={isSmall}
      title={title}
      isOpen
      onClose={onClose}
      actions={isPending ? [] : [
        <Button key="confirm" variant={primaryVariant} onClick={onPrimaryClick} type="submit" isDisabled={isPrimaryDisabled}>
          {primaryText}
        </Button>,
        showSecondery && (
          <Button key="cancel" variant="secondary" onClick={onSecondaryClick}>
            {secondaryText}
          </Button>
        ),
      ]}
      isFooterLeftAligned
      {...extraProps}
    >
      {isPending ? <Spinner centered /> : children}
    </PfModal>
  );
}

Modal.propTypes = {
  isSmall: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  isPrimaryDisabled: PropTypes.bool,
  children: PropTypes.node,
  showSecondery: PropTypes.bool,
  isPending: PropTypes.bool,
  primaryVariant: PropTypes.string,
};

export default Modal;
