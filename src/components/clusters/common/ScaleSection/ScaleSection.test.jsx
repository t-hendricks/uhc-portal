import React from 'react';

import { render, screen, checkAccessibility, within, insightsMock } from '~/testUtils';
import apiRequest from '~/services/apiRequest';
import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import ScaleSection from './ScaleSection';

insightsMock();

const defaultProps = {
  isBYOC: false,
  isMultiAz: false,
  machineType: 'myMachineType',
  cloudProviderID: 'aws',
  product: 'ROSA',
  change: () => {},
  increment: 1,
  minNodesRequired: 2,
  showStorageAndLoadBalancers: false,
  inModal: false,
  isHypershift: false,
};

describe('<ScaleSection />', () => {
  const ConnectedScaleSection = wizardConnector(ScaleSection);
  it('is accessible', async () => {
    const { container } = render(<ConnectedScaleSection {...defaultProps} />);
    await checkAccessibility(container);

    // select aria-label: Compute nodes
  });
  describe('non autoscaling node count hint text', () => {
    apiRequest.get.mockResolvedValue('success');

    it('displays appropriate text when HCP wizard', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        inModal: false,
        isHypershift: true,
      };
      const { user } = render(<ConnectedScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      // ensure non-autoscale selection is showing
      expect(screen.getByRole('combobox', { name: 'Compute nodes' })).toBeInTheDocument();

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
        inModal: false,
        isHypershift: false,
      };
      const { user } = render(<ConnectedScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      // ensure non-autoscale selection is showing
      expect(screen.getByRole('combobox', { name: 'Compute nodes' })).toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.computeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('displays appropriate text when adding a new ROSA classic machine pool', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        inModal: true,
        isHypershift: false,
      };
      const { user } = render(<ConnectedScaleSection {...newProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      // ensure non-autoscale selection is showing
      expect(screen.getByRole('combobox', { name: 'Compute nodes' })).toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Compute node count information' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      // Assert
      expect(
        within(screen.getByRole('dialog')).getByText(constants.computeNodeCountHint),
      ).toBeInTheDocument();
    });

    it('should open nodes labels section by default if node labels are set', async () => {
      // Arrange
      const newProps = {
        ...defaultProps,
        product: 'ROSA',
        inModal: false,
        isHypershift: false,
        hasNodeLabels: true,
      };
      render(<ConnectedScaleSection {...newProps} />);
      // Assert
      const sectionToggle = screen.getByRole('button', { name: 'Add node labels' });
      expect(sectionToggle).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
