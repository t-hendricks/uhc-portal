import React from 'react';
import {
  Button,
  Modal as PfModal,
  ModalProps,
  ModalVariant,
  StackItem,
  Stack,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './Modal.scss';

type Props = Omit<
  ModalProps,
  // exclude props which are supplied
  'ref' | 'aria-label'
> & {
  secondaryTitle?: string;
  showPrimary?: boolean;
  primaryText?: string;
  showSecondary?: boolean;
  secondaryText?: string;
  showTertiary?: boolean;
  tertiaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onTertiaryClick?: () => void;
  isSmall?: boolean;
  modalSize?: ModalProps['variant'];
  isPrimaryDisabled?: boolean;
  isSecondaryDisabled?: boolean;
  isPending?: boolean;
  primaryVariant?: React.ComponentProps<typeof Button>['variant'];
  primaryLink?: string;
  secondaryLink?: string;
};

const Modal = ({
  title = '',
  secondaryTitle = '',
  onClose,
  showPrimary = true,
  primaryText = 'Confirm',
  showSecondary = true,
  secondaryText = 'Cancel',
  showTertiary,
  tertiaryText,
  onPrimaryClick,
  onSecondaryClick,
  onTertiaryClick,
  isSmall = true,
  modalSize = ModalVariant.default,
  isPrimaryDisabled,
  isSecondaryDisabled,
  isPending,
  children,
  primaryVariant = 'primary',
  primaryLink,
  secondaryLink,
  ...extraProps
}: Props) => {
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
      className={isPending ? 'pending-modal' : undefined}
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
};

export default Modal;
