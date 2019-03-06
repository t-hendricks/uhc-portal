import React from 'react';
import { shallow } from 'enzyme';

import RouterShardInputForm from './RouterShardInputForm';

describe('<RouterShardInputForm />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RouterShardInputForm name="foo" />);
    expect(wrapper).toMatchSnapshot();
  });
});
