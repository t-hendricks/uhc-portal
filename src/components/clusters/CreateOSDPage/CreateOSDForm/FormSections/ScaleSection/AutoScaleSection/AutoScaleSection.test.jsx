import React from 'react';
import { render, screen, checkAccessibility, within } from '@testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import AutoScaleSection from './AutoScaleSection';
import { constants } from '../../../CreateOSDFormConstants';

const defaultProps = {
  autoscalingEnabled: true,
  isMultiAz: false,
  product: 'ROSA',
  isBYOC: false,
  isDefaultMachinePool: false,
  change: () => {},
  isHypershiftWizard: true,
  isHypershiftMachinePool: false,
};

describe('<AutoScaleSection />', () => {
  const ConnectedAutoScaleSection = wizardConnector(AutoScaleSection);
  it('is accessible', async () => {
    const { container } = render(<ConnectedAutoScaleSection {...defaultProps} />);

    await checkAccessibility(container);
  });

  describe('Hint help text', () => {
    it('displays appropriate text when HCP wizard', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: true,
        isHypershiftMachinePool: false,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.hcpComputeNodeCountHintWizard),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when ROSA classic wizard', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: false,
        isHypershiftMachinePool: false,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.computeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when adding new HCP machine pool', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: false,
        isHypershiftMachinePool: true,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.hcpComputeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when adding a new ROSA classic machine pool', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: false,
        isHypershiftMachinePool: false,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.computeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when scaling a HCP machine pool', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: false,
        isHypershiftMachinePool: true,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.hcpComputeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when scaling a ROSA classic machine pool', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        isHypershiftWizard: false,
        isHypershiftMachinePool: false,
      };
      const { user } = render(<ConnectedAutoScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.computeNodeCountHint),
      ).toBeInTheDocument();
    });
  });
});
