import React from 'react';
import { shallow } from 'enzyme';
import SubnetFieldsRow from './SubnetFieldsRow';

describe('<SubnetFieldsRow />', () => {
  const wrapper = shallow(
    <SubnetFieldsRow index={0} selectedRegion="fake-region" />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with labels', () => {
    wrapper.setProps({ showLabels: true });
    expect(wrapper).toMatchSnapshot();
  });
});
