import React from 'react';
import { shallow, mount } from 'enzyme';

import MinorVersionUpgradeAlert from '../MinorVersionUpgradeAlert';

import apiRequest from '../../../../../../services/apiRequest';

jest.mock('../../../../../../services/apiRequest');

const enableLink = 'Allow the next minor version update';
const disableLink = 'Disallow this minor version update';

const enableTitleForKnownMinor = 'New minor version available';
const disableTitleForKnownMinor = 'Next minor version update allowed';

const getAlertActionLinksText = wrapper => wrapper.find('Alert').props().actionLinks.props.children.props.children;
const getAlertTitle = wrapper => wrapper.find('Alert').props().title;

jest.useFakeTimers();

describe('<MinorVersionUpgradeAlert >', () => {
  let wrapper;
  let mountWrapper;
  const mockSetUpgradePolicy = jest.fn();
  beforeEach(() => {
    wrapper = shallow(
      <MinorVersionUpgradeAlert
        isMinorVersionUpgradesEnabled
        isAutomatic
        hasUnmetUpgradeAcknowledge={false}
        isNextMinorVersionAvailable
        clusterId="myClusterId"
        automaticUpgradePolicyId="myUpgradePolicyId"
        setUpgradePolicy={() => { }}
      />,
    );
    mountWrapper = mount(
      <MinorVersionUpgradeAlert
        isAutomatic
        isMinorVersionUpgradesEnabled={false}
        hasUnmetUpgradeAcknowledge={false}
        isNextMinorVersionAvailable
        clusterId="myClusterId"
        automaticUpgradePolicyId="myUpgradePolicyId"
        setUpgradePolicy={mockSetUpgradePolicy}
      />,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Alert is not shown if is not automatic', () => {
    wrapper.setProps({
      isAutomatic: false,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('Alert is not shown if has unacknowledged upgrade gates', () => {
    wrapper.setProps({
      hasUnmetUpgradeAcknowledge: true,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('Alert is not shown if upgrade policy is unknown', () => {
    wrapper.setProps({
      automaticUpgradePolicyId: undefined,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('Alert is not shown if clusterId is not known', () => {
    wrapper.setProps({
      clusterId: undefined,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('Alert is not shown when minor upgrade is not available', () => {
    wrapper.setProps({
      isNextMinorVersionAvailable: false,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('Correct data is shown for unapproved minor upgrade when minor upgrade is available', () => {
    wrapper.setProps({
      isMinorVersionUpgradesEnabled: false,
      isNextMinorVersionAvailable: true,
    });
    expect(wrapper.isEmptyRender()).toBe(false);

    expect(wrapper.find('[data-testid="minorVersionUpgradeAlertEnableMessage"]')).toHaveLength(1);
    expect(getAlertActionLinksText(wrapper)).toEqual(enableLink);
    expect(getAlertTitle(wrapper)).toEqual(enableTitleForKnownMinor);
    expect(wrapper).toMatchSnapshot();
  });

  test('Correct data is shown for approved minor upgrade when minor upgrade is available', () => {
    wrapper.setProps({
      isMinorVersionUpgradesEnabled: true,
      isNextMinorVersionAvailable: true,
    });
    expect(wrapper.isEmptyRender()).toBe(false);

    expect(wrapper.find('[data-testid="minorVersionUpgradeAlertDisableMessage"]')).toHaveLength(1);
    expect(getAlertActionLinksText(wrapper)).toEqual(disableLink);
    expect(getAlertTitle(wrapper)).toEqual(disableTitleForKnownMinor);
    expect(wrapper).toMatchSnapshot();
  });

  test('API call is made when user clicks on enable', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);
    mountWrapper.find('AlertActionLink').simulate('click');
    await new Promise(process.nextTick); // wait for all promises to finish
    jest.runAllTimers();
    expect(apiRequest.patch).toHaveBeenCalledWith('/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId', { enable_minor_version_upgrades: true });
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);
    expect(mountWrapper.find('Alert').props().variant).not.toEqual('danger');
  });

  test('API call is made when user clicks on disable', async () => {
    mountWrapper.setProps({
      isMinorVersionUpgradesEnabled: true,
    });
    const apiReturnValue = { data: { enable_minor_version_upgrades: false } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);
    mountWrapper.find('AlertActionLink').simulate('click');
    await new Promise(process.nextTick); // wait for all promises to finish
    jest.runAllTimers();
    expect(apiRequest.patch).toHaveBeenCalledWith('/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId', { enable_minor_version_upgrades: false });
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual(apiReturnValue.data);
    expect(mountWrapper.find('Alert').props().variant).not.toEqual('danger');
  });

  test('Error is shown if patch API call fails', async () => {
    const patchError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValue(patchError);
    mountWrapper.find('AlertActionLink').simulate('click');
    await new Promise(process.nextTick); // wait for all promises to finish
    jest.runAllTimers();
    expect(apiRequest.patch).toHaveBeenCalledWith('/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId', { enable_minor_version_upgrades: true });
    expect(mockSetUpgradePolicy).not.toHaveBeenCalled();
    mountWrapper.update();
    expect(mountWrapper).toMatchSnapshot();
    expect(mountWrapper.find('Alert').props().variant).toEqual('danger');
  });
});
