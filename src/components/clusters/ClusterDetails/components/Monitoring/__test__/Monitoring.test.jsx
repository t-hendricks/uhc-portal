import React from 'react';
import { shallow } from 'enzyme';

import Monitoring from '../Monitoring';

describe('<Monitoring />', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<Monitoring />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
