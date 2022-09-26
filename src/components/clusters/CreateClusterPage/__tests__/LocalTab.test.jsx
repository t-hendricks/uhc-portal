import React from 'react';
import { shallow } from 'enzyme';

import LocalTab from '../LocalTab';

describe('<LocalTab />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<LocalTab token={{}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
