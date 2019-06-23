import React from 'react';
import { shallow } from 'enzyme';

import ClusterDetailsTop from '../components/ClusterDetailsTop';
import {
  clusterDetails,
  openModal,
  routerShards,
  refreshFunc,
  clusterIdentityProviders,
  organization,
} from './ClusterDetails.fixtures';
import clusterStates from '../../common/clusterStates';

describe('<ClusterDetailsTop />', () => {
  let wrapper;
  beforeEach(() => {
    const props = {
      cluster: clusterDetails.cluster,
      openModal,
      pending: clusterDetails.pending,
      routerShards,
      refreshFunc,
      clusterIdentityProviders,
      organization,
    };
    wrapper = shallow(
      <ClusterDetailsTop {...props} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should enable launch console button when cluster has console url and cluster is not uninstalling', () => {
    const launchConsoleDisabled = wrapper.find('Button').at(0).props().disabled;
    expect(launchConsoleDisabled).toEqual(false);
  });

  it('should disable launch console button when console url is missing', () => {
    const cluster = { ...clusterDetails.cluster, console: { url: '' } };
    wrapper.setProps({ cluster }, () => {
      const launchConsoleDisabled = wrapper.find('Button').at(0).props().disabled;
      expect(launchConsoleDisabled).toEqual(true);
    });
  });

  it('should disable launch console button when cluster is unistalling', () => {
    const cluster = { ...clusterDetails.cluster, state: clusterStates.UNINSTALLING };
    wrapper.setProps({ cluster }, () => {
      const launchConsoleDisabled = wrapper.find('Button').at(0).props().disabled;
      expect(launchConsoleDisabled).toEqual(true);
    });
  });

  it('should show error triangle if an error occured', () => {
    wrapper.setProps({ error: true }, () => {
      expect(wrapper.find('ErrorTriangle').length).toEqual(1);
    });
  });
});
