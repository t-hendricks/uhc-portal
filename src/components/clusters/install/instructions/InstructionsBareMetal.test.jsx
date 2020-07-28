import React from 'react';
import { shallow } from 'enzyme';
import { NewClusterModal } from 'facet-lib';

import { InstructionsBareMetal } from './InstructionsBareMetal';

describe('BareMetal instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsBareMetal />);
    expect(wrapper).toMatchSnapshot();
  });
  it('opens AI modal', () => {
    const wrapper = shallow(<InstructionsBareMetal />);
    expect(wrapper.find(NewClusterModal).exists()).toBeFalsy();
    wrapper.find('[data-testid="ai-button"]').simulate('click');
    expect(wrapper.find(NewClusterModal).exists()).toBeTruthy();
  });
});
