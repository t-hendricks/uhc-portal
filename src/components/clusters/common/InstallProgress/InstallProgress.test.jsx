import React from 'react';
import { shallow } from 'enzyme';
import InstallProgress from './InstallProgress';
import clusterStates from '../clusterStates';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<InstallProgress />', () => {
  const clusterInstalling = {
    ...fixtures.clusterDetails.cluster,
    state: clusterStates.INSTALLING,
  };
  const inflightChecks = { fulfilled: true, checks: [] };

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <InstallProgress cluster={clusterInstalling} inflightChecks={inflightChecks} />,
    );
  });

  it('should render correclty installing cluster', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correclty uninstalling cluster', () => {
    wrapper.setProps({
      cluster: {
        ...fixtures.clusterDetails.cluster,
        state: clusterStates.UNINSTALLING,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
