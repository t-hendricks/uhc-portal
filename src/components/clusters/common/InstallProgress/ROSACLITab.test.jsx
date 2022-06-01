import React from 'react';
import { shallow } from 'enzyme';
import ROSACLITab from './ROSACLITab';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<ROSACLITab />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ROSACLITab cluster={fixtures.ROSAManualClusterDetails.cluster} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
