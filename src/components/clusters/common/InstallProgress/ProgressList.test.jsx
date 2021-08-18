import React from 'react';
import { shallow } from 'enzyme';
import ProgressList from './ProgressList';
import clusterStates from '../clusterStates';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ProgressList />', () => {
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

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ProgressList cluster={firstStepPending} />,
    );
  });

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
