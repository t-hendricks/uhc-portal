import React from 'react';
import { shallow } from 'enzyme';
import AWSSubnetFields from './AWSSubnetFields';

describe('<AWSSubnetFields />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <AWSSubnetFields selectedRegion="fake-region" vpcs={{ fulfilled: true }} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
