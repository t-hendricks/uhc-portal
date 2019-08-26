import React from 'react';
import { shallow } from 'enzyme';

import ClusterOperators from '../components/ClusterOperators';

describe('<ClusterOperators />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<ClusterOperators />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
