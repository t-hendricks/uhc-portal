import React from 'react';
import { shallow } from 'enzyme';

import BillingModelLabel from '../BillingModelLabel';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('BillingModelLabel', () => {
  it('for OSD rhInfra cluster', () => {
    const { cluster } = fixtures.clusterDetails;
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSD CCS cluster', () => {
    const { cluster } = fixtures.CCSClusterDetails;
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('for OSDTrial CCS cluster', () => {
    const { cluster } = fixtures.OSDTrialClusterDetails;
    const wrapper = shallow(<BillingModelLabel cluster={cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
