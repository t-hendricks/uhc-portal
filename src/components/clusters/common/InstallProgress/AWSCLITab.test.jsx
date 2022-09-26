import React from 'react';
import { shallow } from 'enzyme';
import AWSCLITab from './AWSCLITab';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<AWSCLITab />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<AWSCLITab cluster={fixtures.ROSAManualClusterDetails.cluster} />);
    expect(wrapper).toMatchSnapshot();
  });
});
