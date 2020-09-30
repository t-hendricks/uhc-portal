import React from 'react';
import { shallow } from 'enzyme';
import InstallProgress from './InstallProgress';
import clusterStates from '../clusterStates';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<InstallProgress />', () => {
  const clusterInstalling = {
    ...fixtures.clusterDetails,
    state: clusterStates.INSTALLING,
  };

  const wrapper = shallow(
    <InstallProgress cluster={clusterInstalling} />,
  );

  it('should render correclty installing cluster', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correclty uninstalling cluster', () => {
    wrapper.setProps(
      {
        cluster:
        {
          ...fixtures.clusterDetails,
          state: clusterStates.UNINSTALLING,
        },
      },
    );
    expect(wrapper).toMatchSnapshot();
  });
});
