import React from 'react';
import { shallow } from 'enzyme';

import EvaluationAlert from '../EvaluationAlert';

describe('EvaluationAlert', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<EvaluationAlert />);
    expect(wrapper).toMatchSnapshot();
  });
});
