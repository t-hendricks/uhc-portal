import React from 'react';
import { shallow } from 'enzyme';
// TODO: Remove this import when PF team fixes the issue causing tests to break without it
import { Button } from '@patternfly/react-core';

import ClusterDetailsTop from '../components/ClusterDetailsTop';
import fixtures, { funcs } from './ClusterDetails.fixtures';
import clusterStates from '../../common/clusterStates';

describe('<ClusterDetailsTop />', () => {
  let wrapper;
  const functions = funcs();

  beforeEach(() => {
    const props = {
      cluster: fixtures.clusterDetails.cluster,
      openModal: functions.openModal,
      pending: fixtures.clusterDetails.pending,
      refreshFunc: functions.refreshFunc,
      clusterIdentityProviders: fixtures.clusterIdentityProviders,
      organization: fixtures.organization,
      canSubscribeOCP: fixtures.canSubscribeOCP,
      canTransferClusterOwnership: fixtures.canTransferClusterOwnership,
      canHibernateCluster: fixtures.canHibernateCluster,
      toggleSubscriptionReleased: functions.toggleSubscriptionReleased,
    };
    wrapper = shallow(
      <ClusterDetailsTop {...props} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show refresh button', () => {
    expect(wrapper.find('RefreshBtn').length).toEqual(1);
  });

  it('should enable open console button when cluster has console url and cluster is not uninstalling', () => {
    const launchConsoleDisabled = wrapper.find(Button).at(0).props().isDisabled;
    expect(launchConsoleDisabled).toBeFalsy();
  });

  it('should disable open console button when console url is missing', () => {
    const cluster = { ...fixtures.clusterDetails.cluster, console: { url: '' } };
    wrapper.setProps({ cluster }, () => {
      const launchConsoleDisabled = wrapper.find(Button).at(0).props().isDisabled;
      expect(launchConsoleDisabled).toEqual(true);
    });
  });

  it('should disable open console button when cluster is unistalling', () => {
    const cluster = { ...fixtures.clusterDetails.cluster, state: clusterStates.UNINSTALLING };
    wrapper.setProps({ cluster }, () => {
      const launchConsoleDisabled = wrapper.find(Button).at(0).props().isDisabled;
      expect(launchConsoleDisabled).toEqual(true);
    });
  });

  it('should show error triangle if an error occured', () => {
    wrapper.setProps({ error: true }, () => {
      expect(wrapper.find('ErrorTriangle').length).toEqual(1);
    });
  });

  it('should show only Unarchive button if the cluster is archived', () => {
    const cluster = { ...fixtures.clusterDetails.cluster, subscription: { status: 'Archived', id: 'fake' } };
    wrapper.setProps({ cluster }, () => {
      const unarchiveButton = wrapper.find(Button).at(0);
      expect(unarchiveButton.props().variant).toEqual('secondary');
      expect(unarchiveButton.props().children).toEqual('Unarchive');
      expect(wrapper.find('ClusterActionsDropdown').length).toEqual(0); // no cluster actions dropdown
      expect(wrapper.find('RefreshBtn').length).toEqual(0); // no refresh button
      unarchiveButton.simulate('click');
      expect(functions.openModal).toBeCalledWith('unarchive-cluster', { subscriptionID: 'fake', name: cluster.name });
    });
  });
});
