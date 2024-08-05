import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import * as Fixtures from './ClusterActionsDropdown.fixtures';
import { dropDownItems } from './ClusterActionsDropdownItems';

function DropDownItemsRenderHelper(props) {
  return dropDownItems(props);
}

const menuItemsText = [
  'Open console',
  'Edit display name',
  'Edit load balancers and persistent storage',
  'Edit machine pool',
  'Hibernate cluster',
  'Delete cluster',
];

describe('Cluster Actions Dropdown Items', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('cluster with state ready and console url', () => {
    it('is accessible', async () => {
      const { container } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      await checkAccessibility(container);

      // Ensures that the menu items are in the expected order
      const foundMenuItems = screen.getAllByRole('menuitem');
      expect(foundMenuItems).toHaveLength(menuItemsText.length);
      menuItemsText.forEach((menuItemText, index) => {
        expect(foundMenuItems[index]).toHaveTextContent(menuItemText);
      });
    });

    it('opens edit display name modal', async () => {
      const { user } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      expect(Fixtures.managedReadyProps.openModal).toBeCalledTimes(0);
      await user.click(screen.getByRole('menuitem', { name: 'Edit display name' }));

      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith(
        'edit-display-name',
        Fixtures.cluster,
      );
    });

    it('should open edit cluster modal (load balancers and persistent storage)', async () => {
      const { user } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      expect(Fixtures.managedReadyProps.openModal).toBeCalledTimes(0);
      await user.click(
        screen.getByRole('menuitem', { name: 'Edit load balancers and persistent storage' }),
      );

      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-cluster', Fixtures.cluster);
    });

    it('should open edit machine pools modal', async () => {
      const { user } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      expect(Fixtures.managedReadyProps.openModal).toBeCalledTimes(0);
      await user.click(screen.getByRole('menuitem', { name: 'Edit machine pool' }));

      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-machine-pool', {
        cluster: Fixtures.cluster,
      });
    });

    it('should open hibernate cluster modal', async () => {
      const { user } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      expect(Fixtures.managedReadyProps.openModal).toBeCalledTimes(0);
      await user.click(screen.getByRole('menuitem', { name: 'Hibernate cluster' }));
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith(
        'hibernate-cluster',
        Fixtures.hibernateClusterModalData,
      );
    });

    it('should open delete modal', async () => {
      const { user } = render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
      expect(Fixtures.managedReadyProps.openModal).toBeCalledTimes(0);
      await user.click(screen.getByRole('menuitem', { name: 'Delete cluster' }));
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith(
        'delete-cluster',
        Fixtures.deleteModalData,
      );
    });

    it.each(menuItemsText)('menu button %p is enabled', (menuItem) => {
      render(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);

      expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute('aria-disabled');
    });

    describe('and product osdtrial', () => {
      it('is accessible', async () => {
        const { container } = render(
          <DropDownItemsRenderHelper {...Fixtures.managedReadyOsdTrialProps} />,
        );
        await checkAccessibility(container);
      });

      it('has Upgrade cluster from Trial option ', () => {
        render(<DropDownItemsRenderHelper {...Fixtures.managedReadyOsdTrialProps} />);
        expect(
          screen.getByRole('menuitem', { name: 'Upgrade cluster from Trial' }),
        ).toBeInTheDocument();
      });

      it('does not have hibernate cluster option', () => {
        render(<DropDownItemsRenderHelper {...Fixtures.managedReadyOsdTrialProps} />);
        expect(
          screen.queryByRole('menuitem', { name: 'Hibernate cluster' }),
        ).not.toBeInTheDocument();
      });
      it.each(menuItemsText.filter((item) => item !== 'Hibernate cluster'))(
        'menu button %p is available',
        (menuItem) => {
          render(<DropDownItemsRenderHelper {...Fixtures.managedReadyOsdTrialProps} />);
          expect(screen.getByRole('menuitem', { name: menuItem })).toBeInTheDocument();
        },
      );
    });
  });

  describe('cluster with state uninstalling', () => {
    it('is accessible (uninstalling)', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.clusterUninstallingProps} />,
      );
      await checkAccessibility(container);
    });

    it.each(menuItemsText)('menu button %p is disabled', (menuItem) => {
      render(<DropDownItemsRenderHelper {...Fixtures.clusterUninstallingProps} />);

      expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  describe('cluster with state not ready', () => {
    it('is accessible (not ready)', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.clusterNotReadyProps} />,
      );
      await checkAccessibility(container);
    });

    it.each([
      ['Open console', 'true'],
      ['Edit display name', 'false'],
      ['Edit load balancers and persistent storage', 'true'],
      ['Edit machine pool', 'true'],
      ['Hibernate cluster', 'true'],
      ['Delete cluster', 'false'],
    ])('menu button %p  disabled is set to %p', (menuItem, isDisabled) => {
      render(<DropDownItemsRenderHelper {...Fixtures.clusterNotReadyProps} />);
      if (isDisabled === 'true') {
        expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
          'aria-disabled',
          isDisabled,
        );
      } else {
        expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute(
          'aria-disabled',
        );
      }
    });
  });

  describe('cluster state hibernating', () => {
    it('is accessible (hibernating)', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.clusterHibernatingProps} />,
      );
      await checkAccessibility(container);
    });

    it.each([
      ['Open console', 'true'],
      ['Edit display name', 'false'],
      ['Edit load balancers and persistent storage', 'true'],
      ['Edit machine pool', 'true'],
      ['Resume from Hibernation', 'false'],
      ['Delete cluster', 'true'],
    ])('menu button %p  disabled is set to %p', (menuItem, isDisabled) => {
      render(<DropDownItemsRenderHelper {...Fixtures.clusterHibernatingProps} />);
      if (isDisabled === 'true') {
        expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
          'aria-disabled',
          isDisabled,
        );
      } else {
        expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute(
          'aria-disabled',
        );
      }
    });
  });

  describe('cluster configuration_mode read_only', () => {
    it('is accessible (read_only)', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.clusterReadOnlyProps} />,
      );
      await checkAccessibility(container);
    });

    it.each([
      ['Open console', 'false'],
      ['Edit display name', 'false'],
      ['Edit load balancers and persistent storage', 'true'],
      ['Edit machine pool', 'true'],
      ['Hibernate cluster', 'true'],
      ['Delete cluster', 'true'],
    ])('menu button %p  disabled is set to %p', (menuItem, isDisabled) => {
      render(<DropDownItemsRenderHelper {...Fixtures.clusterReadOnlyProps} />);
      if (isDisabled === 'true') {
        expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
          'aria-disabled',
          isDisabled,
        );
      } else {
        expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute(
          'aria-disabled',
        );
      }
    });
  });

  describe('self managed cluster', () => {
    it('is accessible (self managed / no console)', async () => {
      const { container } = render(<DropDownItemsRenderHelper {...Fixtures.selfManagedProps} />);
      await checkAccessibility(container);
    });

    it.each([
      ['Open console', 'true'],
      ['Edit display name', 'false'],
      ['Add console URL', 'false'],
    ])('menu button %p  disabled is set to %p', (menuItem, isDisabled) => {
      render(<DropDownItemsRenderHelper {...Fixtures.selfManagedProps} />);
      if (isDisabled === 'true') {
        expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
          'aria-disabled',
          isDisabled,
        );
      } else {
        expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute(
          'aria-disabled',
        );
      }
    });
  });

  describe('read only cluster', () => {
    it('is accessible', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.organizationClusterProps} />,
      );
      await checkAccessibility(container);
    });

    it('only open console options is available', () => {
      render(<DropDownItemsRenderHelper {...Fixtures.organizationClusterProps} />);
      expect(screen.getByRole('menuitem')).toHaveTextContent('Open console');

      expect(screen.getByRole('menuitem')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('Hypershift cluster', () => {
    it('is accessible (hypershift)', async () => {
      const { container } = render(
        <DropDownItemsRenderHelper {...Fixtures.hyperShiftReadyProps} />,
      );
      await checkAccessibility(container);
    });

    it.each([
      ['Open console', 'false'],
      ['Edit display name', 'false'],
      ['Edit load balancers and persistent storage', 'false'],
      ['Edit machine pool', 'false'],
      ['Delete cluster', 'false'],
    ])('menu button %p  disabled is set to %p', (menuItem, isDisabled) => {
      render(<DropDownItemsRenderHelper {...Fixtures.hyperShiftReadyProps} />);
      if (isDisabled === 'true') {
        expect(screen.getByRole('menuitem', { name: menuItem })).toHaveAttribute(
          'aria-disabled',
          isDisabled,
        );
      } else {
        expect(screen.getByRole('menuitem', { name: menuItem })).not.toHaveAttribute(
          'aria-disabled',
        );
      }
    });
  });
});
