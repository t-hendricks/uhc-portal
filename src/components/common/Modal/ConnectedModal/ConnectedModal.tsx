import React from 'react';

type Props<P = {}> = {
  isOpen?: boolean;
  ModalComponent: React.ComponentType<P> & { modalName: string };
} & P;

const ConnectedModal = ({ ModalComponent, isOpen, ...props }: Props) => {
  if (!ModalComponent.modalName) {
    // Error handling to ensure catching badly defined modals as early as possible
    throw new Error('Modal component missing name');
  }

  return isOpen ? <ModalComponent {...props} /> : null;
};

export default ConnectedModal;
