import React from 'react';
import { shallow } from 'enzyme';

import AddOnsRequirementContent from '../AddOnsDrawerRequirementContent';

describe('<AddOnsRequirementContent />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AddOnsRequirementContent
      activeCardRequirements={[
        'first requirement',
        'second requirement',
      ]}
    />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render all requirements', () => {
    expect(wrapper.find('ListItem').at(0).props().children).toEqual('first requirement');
    expect(wrapper.find('ListItem').at(1).props().children).toEqual('second requirement');
  });

  it('expect to not render and ListItems if not requirements are passed', () => {
    wrapper.setProps({
      activeCardRequirements: null,
    });
    expect(wrapper.find('List').props().children).toEqual(undefined);
  });
});
