import React from 'react';
import { shallow } from 'enzyme';

import ClusterDetailsTop from '../components/ClusterDetailsTop';
import {
  clusterDetails, credentials, openModal, routerShards, refreshFunc,
} from './ClusterDetails.fixtures';
import clusterStates from '../../common/clusterStates';

describe('<ClusterDetailsTop />', () => {
  let wrapper;
  beforeEach(() => {
    const props = {
      cluster: clusterDetails.cluster,
      credentials,
      openModal,
      pending: clusterDetails.pending,
      routerShards,
      refreshFunc,
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

  it('should enable admin credentials button when cluster is ready and has credential', () => {
    const adminCredentialsDisabled = wrapper.find('Button').at(1).props().disabled;
    expect(adminCredentialsDisabled).toEqual(false);
  });

  it('should disable admin credentials button when cluster is not ready', () => {
    const cluster = { ...clusterDetails.cluster, state: clusterStates.INSTALLING };
    wrapper.setProps({ cluster }, () => {
      const adminCredentialsDisabled = wrapper.find('Button').at(1).props().disabled;
      expect(adminCredentialsDisabled).toEqual(true);
    });
  });

  it('should disable admin credentials button when credentials doesn\'t exist', () => {
    wrapper.setProps({ credentials: {} }, () => {
      const adminCredentialsDisabled = wrapper.find('Button').at(1).props().disabled;
      expect(adminCredentialsDisabled).toEqual(true);
    });
  });
});
