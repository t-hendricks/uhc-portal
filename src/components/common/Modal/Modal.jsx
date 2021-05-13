import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as PfModal } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { noop } from '../../../common/helpers';

function Modal({
  title = '',
  onClose = noop,
  showPrimary = true,
  primaryText = 'Confirm',
  showSecondary = true,
  secondaryText = 'Cancel',
  showTertiary = false,
  tertiaryText,
  onPrimaryClick = noop,
  onSecondaryClick = noop,
  onTertiaryClick = noop,
  isSmall = true,
  modalSize,
  isPrimaryDisabled = false,
  isSecondaryDisabled = false,
  isPending = false,
  children = null,
  primaryVariant = 'primary',
  primaryLink,
  secondaryLink,
  ...extraProps
}) {
  return (
    <PfModal
      // For a medium size modal use variant="large".
      // For a full screen modal use isSmall=false.
      className={isPending ? 'pending-modal' : null}
      variant={modalSize || (isSmall ? 'small' : undefined)}
      title={title}
      isOpen
      onClose={onClose}
      actions={isPending ? [] : [
        showPrimary && !primaryLink && (
          <Button
            key="confirm"
            variant={primaryVariant}
            onClick={onPrimaryClick}
            type="submit"
            isDisabled={isPrimaryDisabled}
          >
            {primaryText}
          </Button>
        ),
        showPrimary && primaryLink && (
          <Button
            key="confirm"
            variant={primaryVariant}
            component="a"
            target="_blank"
            href={primaryLink}
            isDisabled={isPrimaryDisabled}
          >
            {primaryText}
          </Button>
        ),
        showSecondary && !secondaryLink && (
          <Button key="secondary" variant="secondary" onClick={onSecondaryClick}>
            {secondaryText}
          </Button>
        ),
        showSecondary && secondaryLink && (
          <Button
            key="secondary"
            variant="secondary"
            component="a"
            target="_blank"
            href={secondaryLink}
            isDisabled={isSecondaryDisabled}
          >
            {secondaryText}
          </Button>
        ),
        showTertiary && (
          <Button key="tertiary" variant="secondary" onClick={onTertiaryClick}>
            {tertiaryText}
          </Button>
        ),
      ]}
      {...extraProps}
    >
      {isPending ? <Spinner centered /> : children}
    </PfModal>
  );
}

Modal.propTypes = {
  isSmall: PropTypes.bool,
  modalSize: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  primaryLink: PropTypes.string,
  secondaryLink: PropTypes.string,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  tertiaryText: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  onTertiaryClick: PropTypes.func,
  isPrimaryDisabled: PropTypes.bool,
  isSecondaryDisabled: PropTypes.bool,
  isTertiaryDisabled: PropTypes.bool,
  children: PropTypes.node,
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
  showTertiary: PropTypes.bool,
  isPending: PropTypes.bool,
  primaryVariant: PropTypes.string,
};

export default Modal;
