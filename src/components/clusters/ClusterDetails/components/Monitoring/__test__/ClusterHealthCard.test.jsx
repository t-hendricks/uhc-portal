import React from 'react';
import { shallow } from 'enzyme';

import ClusterHealthCard from '../components/ClusterHealthCard';

describe('<ClusterHealthCard />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<ClusterHealthCard />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
