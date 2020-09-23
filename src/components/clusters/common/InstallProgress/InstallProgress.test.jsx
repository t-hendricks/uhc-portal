import React from 'react';
import { shallow } from 'enzyme';
import InstallProgress from './InstallProgress';
import clusterStates from '../clusterStates';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';
import InstallationLogView from '../../ClusterDetails/components/Overview/InstallationLogView';
import ClusterStatusMonitor from '../../ClusterDetails/components/Overview/ClusterStatusMonitor';

describe('<InstallProgress />', () => {
  const firstStepPending = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.PENDING,
  };

  const firstStepCompleted = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
  };

  const secondStepCompleted = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
    dns_ready: true,
  };

  const wrapper = shallow(
    <InstallProgress cluster={firstStepPending}>
      <ClusterStatusMonitor />
      <InstallationLogView />
    </InstallProgress>,
  );

  it('should render when first step in progress', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when first step completed', () => {
    wrapper.setProps({ cluster: firstStepCompleted });
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when second step completed', () => {
    wrapper.setProps({ cluster: secondStepCompleted });
    expect(wrapper).toMatchSnapshot();
  });
});
