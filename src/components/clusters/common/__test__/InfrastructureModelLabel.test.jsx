import React from 'react';
import { shallow } from 'enzyme';

import InfrastructureModelLabel from '../InfrastructureModelLabel';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('InfrastructureModelLabel', () => {
  it('for OSD rhInfra cluster', () => {
    const { cluster } = fixtures.clusterDetails;
    const wrapper = shallow(<InfrastructureModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSD CCS cluster', () => {
    const { cluster } = fixtures.CCSClusterDetails;
    const wrapper = shallow(<InfrastructureModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSDTrial CCS cluster', () => {
    const { cluster } = fixtures.OSDTrialClusterDetails;
    const wrapper = shallow(<InfrastructureModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
