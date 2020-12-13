import React from 'react';
import { shallow } from 'enzyme';
import SubnetFields from './SubnetFields';

describe('<SubnetFields />', () => {
  const wrapper = shallow(
    <SubnetFields selectedRegion="fake-region" />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
