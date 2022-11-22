import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Modal as PfModal,
  ModalVariant,
  StackItem,
  Stack,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './Modal.scss';
import { noop } from '../../../common/helpers';

function Modal({
  title = '',
  secondaryTitle = '',
  onClose = noop,
  showPrimary = true,
  primaryText = 'Confirm',
  showSecondary = true,
  secondaryText = 'Cancel',
  showTertiary = false,
  tertiaryText = null,
  onPrimaryClick = noop,
  onSecondaryClick = noop,
  onTertiaryClick = noop,
  isSmall = true,
  modalSize = ModalVariant.default,
  isPrimaryDisabled = false,
  isSecondaryDisabled = false,
  isPending = false,
  children,
  primaryVariant = 'primary',
  primaryLink = null,
  secondaryLink = null,
  ...extraProps
}) {
  const header = secondaryTitle ? (
    <Stack>
      <StackItem>
        <Title headingLevel="h1">{title}</Title>
      </StackItem>
      <StackItem className="modal-secondary-title">
        <Split>
          <SplitItem>Cluster</SplitItem>
          <SplitItem>{secondaryTitle}</SplitItem>
        </Split>
      </StackItem>
    </Stack>
  ) : undefined;

  return (
    <PfModal
      // For a medium size modal use variant="large".
      // For a full screen modal use isSmall=false.
      className={isPending ? 'pending-modal' : null}
      aria-label={title}
      variant={isSmall ? ModalVariant.small : modalSize}
      title={title}
      header={header}
      isOpen
      onClose={onClose}
      actions={
        isPending
          ? []
          : [
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
            ]
      }
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
  secondaryTitle: PropTypes.string,
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
