import React from 'react';
import { shallow } from 'enzyme';
import SubnetFields from './SubnetFields';

describe('<SubnetFields />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SubnetFields selectedRegion="fake-region" />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
