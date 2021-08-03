import React from 'react';
import { shallow } from 'enzyme';

import AddOnsPrimaryButton from '../AddOnsDrawerPrimaryButton';

import { managedIntegration } from '../../__test__/AddOns.fixtures';

describe('<AddOnsPrimaryButton />', () => {
  let wrapper;
  const addClusterAddOn = jest.fn();
  const addClusterAddOnResponse = {};
  const openModal = jest.fn();

  beforeAll(() => {
    wrapper = shallow(<AddOnsPrimaryButton
      activeCard={managedIntegration}
      activeCardRequirementsFulfilled
      addClusterAddOn={addClusterAddOn}
      addClusterAddOnResponse={addClusterAddOnResponse}
      cluster={{
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      }}
      hasQuota
      installedAddOn={{ state: 'ready', operator_version: '0.0.1' }}
      openModal={openModal}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render both open and uninstall buttons for ready cluster', () => {
    const OpenButton = wrapper.find('Button').at(0).props();

    expect(OpenButton.children[0]).toEqual('Open in Console');
    expect(OpenButton.href).toEqual(
      'https://example.com/veryfakeconsole/k8s/ns/redhat-rhmi-operator/operators.coreos.com~v1alpha1~ClusterServiceVersion/integreatly-operator.v0.0.1',
    );

    const UninstallButton = wrapper.find('ButtonWithTooltip').at(0).props();
    expect(UninstallButton.children).toEqual('Uninstall');
    expect(UninstallButton.disableReason).toBeFalsy();
  });

  it('uninstall button should open uninstall modal', () => {
    const UninstallButton = wrapper.find('ButtonWithTooltip').at(0);
    UninstallButton.simulate('click');
    expect(openModal).toBeCalledWith('add-ons-delete-modal', { addOnName: managedIntegration.name, addOnID: managedIntegration.id, clusterID: 'fake id' });
  });

  it('expect contact support button if addon failed', () => {
    wrapper.setProps({
      installedAddOn: { state: 'failed', operator_version: '0.0.1' },
    });
    const SupportButton = wrapper.find('Button').at(0);
    expect(SupportButton.props().children).toEqual('Contact support');
    expect(SupportButton.props().href).toEqual('https://access.redhat.com/support/cases/#/case/new');
  });

  it('expect install button to be disabled if cluster is not ready', () => {
    wrapper.setProps({
      installedAddOn: null,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'installing',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    });

    const InstallButton = wrapper.find('ButtonWithTooltip').at(0);
    expect(InstallButton.props().disableReason).toBeTruthy();
    expect(InstallButton.props().children).toEqual('Install');
  });

  it('expect install button to be disabled if no cluster edit', () => {
    wrapper.setProps({
      installedAddOn: null,
      cluster: {
        canEdit: false,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    });

    const InstallButton = wrapper.find('ButtonWithTooltip');
    expect(InstallButton.props().disableReason).toBeTruthy();
    expect(InstallButton.props().children).toEqual('Install');
  });

  it('expect install button to be disabled if cluster addon is pending', () => {
    wrapper.setProps({
      installedAddOn: null,
      addClusterAddOnResponse: { pending: true },
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    });

    const InstallButton = wrapper.find('ButtonWithTooltip');
    expect(InstallButton.props().disableReason).toBeTruthy();
    expect(InstallButton.props().children).toEqual('Install');
  });

  it('expect install button to be disabled if cluster addon requirements are not met', () => {
    wrapper.setProps({
      installedAddOn: null,
      addClusterAddOnResponse: {},
      activeCardRequirementsFulfilled: false,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    });

    const InstallButton = wrapper.find('ButtonWithTooltip');
    expect(InstallButton.props().disableReason).toBeTruthy();
    expect(InstallButton.props().children).toEqual('Install');
  });

  it('expect to be able to install if user has permission and cluster is ready', () => {
    wrapper.setProps({
      installedAddOn: null,
      addClusterAddOnResponse: { pending: false },
      activeCardRequirementsFulfilled: true,
      cluster: {
        canEdit: true,
        id: 'fake id',
        state: 'ready',
        console: { url: 'https://example.com/veryfakeconsole' },
      },
    });

    const InstallButton = wrapper.find('ButtonWithTooltip');
    expect(InstallButton.props().variant).toEqual('primary');
    expect(InstallButton.props().disableReason).toBeFalsy();
    expect(InstallButton.props().children).toEqual('Install');

    InstallButton.simulate('click');
    expect(openModal).toBeCalledWith('add-ons-parameters-modal', { addOn: managedIntegration, isUpdateForm: false, clusterID: 'fake id' });
  });
});
