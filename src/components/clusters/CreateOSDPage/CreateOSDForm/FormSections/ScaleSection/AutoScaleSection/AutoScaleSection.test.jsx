import React from 'react';

import { render, screen, checkAccessibility, within } from '~/testUtils';
import wizardConnector from '~/components/clusters/CreateOSDPage/CreateOSDWizard/WizardConnector';
import { MAX_NODES_HCP } from '~/components/clusters/common/machinePools/constants';
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
  autoScaleMinNodesValue: '1',
  autoScaleMaxNodesValue: '1',
  numPools: 2,
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

  it('Error shows whole number when over the limit', async () => {
    const numPools = 4;
    const enteredNum = 50;

    const newProps = {
      ...defaultProps,
      numPools,
    };

    // Validate test input
    expect(MAX_NODES_HCP % numPools).not.toEqual(0); // ensure max user can enter is not a whole number
    expect(enteredNum * numPools).toBeGreaterThan(MAX_NODES_HCP); // entered value is over total max nodes

    const { user } = render(<ConnectedAutoScaleSection {...newProps} />);

    const maxNodesInput = screen.getByRole('spinbutton', { name: 'Maximum nodes' });

    await user.clear(maxNodesInput);
    await user.type(maxNodesInput, `${enteredNum}`);

    // Ensure that shown number is a whole number
    const maxUserCanEnter = Math.floor(MAX_NODES_HCP / numPools);
    expect(
      await screen.findByText(`Input cannot be more than ${maxUserCanEnter}.`),
    ).toBeInTheDocument();
  });

  it('Error not shown when not over the limit', async () => {
    const numPools = 4;
    const enteredNum = 10;

    const newProps = {
      ...defaultProps,
      numPools,
    };

    // Validate test input
    expect(enteredNum * numPools).toBeLessThan(MAX_NODES_HCP); // entered value is under total max nodes

    const { user } = render(<ConnectedAutoScaleSection {...newProps} />);

    const maxNodesInput = screen.getByRole('spinbutton', { name: 'Maximum nodes' });

    await user.clear(maxNodesInput);
    await user.type(maxNodesInput, `${enteredNum}`);

    expect(screen.queryByText(/Input cannot be more than/)).not.toBeInTheDocument();
  });
});
