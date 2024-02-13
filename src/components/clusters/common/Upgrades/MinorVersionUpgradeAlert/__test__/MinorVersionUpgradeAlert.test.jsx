import React from 'react';
import { render, screen, userEvent, act } from '~/testUtils';
import apiRequest from '~/services/apiRequest';

import MinorVersionUpgradeAlert from '../MinorVersionUpgradeAlert';

const enableLinkText = 'Allow the next minor version update';
const disableLinkText = 'Disallow this minor version update';

const enableTitleForKnownMinor = 'New minor version available';
const disableTitleForKnownMinor = 'Next minor version update allowed';

jest.useFakeTimers({
  legacyFakeTimers: true, // TODO 'modern'
});

describe('<MinorVersionUpgradeAlert >', () => {
  const setUpgradePolicy = jest.fn();

  const defaultProps = {
    isMinorVersionUpgradesEnabled: true,
    isAutomatic: true,
    hasUnmetUpgradeAcknowledge: false,
    isNextMinorVersionAvailable: true,
    clusterId: 'myClusterId',
    automaticUpgradePolicyId: 'myUpgradePolicyId',
    setUpgradePolicy,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Alert is not shown if is not automatic', () => {
    const newProps = {
      ...defaultProps,
      isAutomatic: false,
    };
    const { container } = render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Alert is not shown if has unacknowledged upgrade gates', () => {
    const newProps = {
      ...defaultProps,
      hasUnmetUpgradeAcknowledge: true,
    };
    const { container } = render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Alert is not shown if upgrade policy is unknown', () => {
    const newProps = {
      ...defaultProps,
      automaticUpgradePolicyId: undefined,
    };
    const { container } = render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Alert is not shown if clusterId is not known', () => {
    const newProps = {
      ...defaultProps,
      clusterId: undefined,
    };
    const { container } = render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Alert is not shown when minor upgrade is not available', () => {
    const newProps = {
      ...defaultProps,
      isNextMinorVersionAvailable: false,
    };
    const { container } = render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Correct data is shown for unapproved minor upgrade when minor upgrade is available', async () => {
    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: false,
      isNextMinorVersionAvailable: true,
    };
    render(<MinorVersionUpgradeAlert {...newProps} />);

    expect(await screen.findByText(enableTitleForKnownMinor)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enableLinkText })).toBeInTheDocument();
  });

  it('Correct data is shown for approved minor upgrade when minor upgrade is available', async () => {
    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: true,
      isNextMinorVersionAvailable: true,
    };
    render(<MinorVersionUpgradeAlert {...newProps} />);
    expect(await screen.findByText(disableTitleForKnownMinor)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: disableLinkText })).toBeInTheDocument();
  });

  it('API call is made when user clicks on enable', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: false,
    };
    const { user } = render(<MinorVersionUpgradeAlert {...newProps} />);

    await act(async () => {
      await user.click(screen.getByRole('button', { name: enableLinkText }));
      await new Promise(process.nextTick); // wait for all promises to finish
      jest.runAllTimers();
    });

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(setUpgradePolicy.mock.calls).toHaveLength(1);
    expect(setUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);
    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('API call is made when user clicks on disable', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: false } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: true,
    };
    const { user } = render(<MinorVersionUpgradeAlert {...newProps} />);

    await act(async () => {
      await user.click(screen.getByRole('button', { name: disableLinkText }));
      await new Promise(process.nextTick); // wait for all promises to finish
      jest.runAllTimers();
    });

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: false },
    );
    expect(setUpgradePolicy.mock.calls).toHaveLength(1);
    expect(setUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);

    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('Error is shown if patch API call fails', async () => {
    const patchError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValue(patchError);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: true,
    };
    const { user } = render(<MinorVersionUpgradeAlert {...newProps} />);

    await user.click(screen.getByRole('button', { name: disableLinkText }));
    await new Promise(process.nextTick); // wait for all promises to finish
    jest.runAllTimers();

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: false },
    );
    expect(setUpgradePolicy).not.toHaveBeenCalled();
    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
  });
  it('(HCP) API call is made when user clicks on enable with hosted control plane cluster', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: false,
      isHypershift: true,
    };
    render(<MinorVersionUpgradeAlert {...newProps} />);

    const user = userEvent.setup({
      delay: null,
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: enableLinkText }));
      await new Promise(process.nextTick); // wait for all promises to finish
      jest.runAllTimers();
    });

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(setUpgradePolicy.mock.calls).toHaveLength(1);
    expect(setUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);
    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('(HCP) API call is made when user clicks on disable with hosted control plane cluster', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: false } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: true,
      isHypershift: true,
    };
    render(<MinorVersionUpgradeAlert {...newProps} />);
    const user = userEvent.setup({
      delay: null,
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: disableLinkText }));
      await new Promise(process.nextTick); // wait for all promises to finish
      jest.runAllTimers();
    });

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: false },
    );
    expect(setUpgradePolicy.mock.calls).toHaveLength(1);
    expect(setUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);

    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('(HCP) Error is shown if patch API call fails with hosted control plane cluster', async () => {
    const patchError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValue(patchError);

    const newProps = {
      ...defaultProps,
      isMinorVersionUpgradesEnabled: true,
      isHypershift: true,
    };
    render(<MinorVersionUpgradeAlert {...newProps} />);
    const user = userEvent.setup({
      delay: null,
    });
    await user.click(screen.getByRole('button', { name: disableLinkText }));
    await new Promise(process.nextTick); // wait for all promises to finish
    jest.runAllTimers();

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: false },
    );
    expect(setUpgradePolicy).not.toHaveBeenCalled();
  });
});
