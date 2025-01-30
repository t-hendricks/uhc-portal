import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { managedIntegration } from '../../__tests__/AddOns.fixtures';
import AddOnsPrimaryButton from '../AddOnsDrawerPrimaryButton';

describe('<AddOnsPrimaryButton />', () => {
  const addClusterAddOn = jest.fn();
  const addClusterAddOnResponse = {};
  const openModal = jest.fn();
  const subscriptionModels = {
    [managedIntegration.id]: {
      addOn: managedIntegration.id,
      billingModel: 'standard',
      cloudAccount: '',
    },
  };

  const props = {
    activeCard: managedIntegration,
    activeCardRequirementsFulfilled: true,
    addClusterAddOn,
    addClusterAddOnResponse,
    cluster: {
      canEdit: true,
      id: 'fake id',
      state: 'ready',
      console: { url: 'https://example.com/veryfakeconsole' },
    },
    hasQuota: true,
    installedAddOn: { state: 'ready', operator_version: '0.0.1', csv_name: 'fake-addon.0.0.1' },
    openModal,
    subscriptionModels,
  };

  afterEach(() => {
    addClusterAddOn.mockClear();
    openModal.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<AddOnsPrimaryButton {...props} />);
    await checkAccessibility(container);
  });

  it('should render both open and uninstall buttons for ready cluster', () => {
    render(<AddOnsPrimaryButton {...props} />);

    expect(screen.getByRole('link', { name: 'Open in Console' })).toHaveAttribute(
      'href',
      'https://example.com/veryfakeconsole/k8s/ns/redhat-rhmi-operator/operators.coreos.com~v1alpha1~ClusterServiceVersion/fake-addon.0.0.1',
    );

    expect(screen.getByRole('link', { name: 'Open in Console' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );

    expect(screen.getByRole('button', { name: 'Uninstall' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });

  it('uninstall button should open uninstall modal', async () => {
    expect(openModal).not.toHaveBeenCalled();

    const { user } = render(<AddOnsPrimaryButton {...props} />);
    await user.click(screen.getByRole('button', { name: 'Uninstall' }));

    expect(openModal).toHaveBeenCalledWith('add-ons-delete-modal', {
      addOnName: managedIntegration.name,
      addOnID: managedIntegration.id,
      clusterID: 'fake id',
    });
  });

  it('expect contact support button if addon failed', () => {
    const failedProps = {
      ...props,
      installedAddOn: { state: 'failed', operator_version: '0.0.1' },
    };

    render(<AddOnsPrimaryButton {...failedProps} />);

    expect(screen.getByRole('link', { name: 'Contact support' })).toHaveAttribute(
      'href',
      'https://access.redhat.com/support/cases/#/case/new',
    );
  });

  it('expect install button to be disabled if cluster is not ready', () => {
    const notReadyProps = {
      ...props,
      installedAddOn: null,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'installing',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    };

    render(<AddOnsPrimaryButton {...notReadyProps} />);

    expect(screen.getByRole('button', { name: 'Install' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('expect install button to be disabled if no cluster edit', () => {
    const noEditProps = {
      ...props,
      installedAddOn: null,
      cluster: {
        canEdit: false,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    };

    render(<AddOnsPrimaryButton {...noEditProps} />);

    expect(screen.getByRole('button', { name: 'Install' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('expect install button to be disabled if cluster addon is pending', () => {
    const pendingProps = {
      ...props,
      installedAddOn: null,
      addClusterAddOnResponse: { pending: true },
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    };
    render(<AddOnsPrimaryButton {...pendingProps} />);

    expect(screen.getByRole('button', { name: 'Install' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('expect install button to be disabled if cluster addon requirements are not met', () => {
    const reqsNotMeetProps = {
      ...props,
      installedAddOn: null,
      addClusterAddOnResponse: {},
      activeCardRequirementsFulfilled: false,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    };

    render(<AddOnsPrimaryButton {...reqsNotMeetProps} />);

    expect(screen.getByRole('button', { name: 'Install' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('expect to be able to install if user has permission and cluster is ready', async () => {
    const canInstallProps = {
      ...props,
      installedAddOn: null,
      addClusterAddOnResponse: { pending: false },
      activeCardRequirementsFulfilled: true,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    };

    const { user } = render(<AddOnsPrimaryButton {...canInstallProps} />);

    expect(screen.getByRole('button', { name: 'Install' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );

    await user.click(screen.getByRole('button', { name: 'Install' }));

    expect(openModal).toHaveBeenCalledWith('add-ons-parameters-modal', {
      addOn: managedIntegration,
      isUpdateForm: false,
      clusterID: 'fake id',
    });
  });
});
