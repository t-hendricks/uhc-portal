import React from 'react';
import { shallow } from 'enzyme';
import { render, checkAccessibility } from '@testUtils';
import AddOnsRequirementContent from '../AddOnsDrawerRequirementContent';

describe('<AddOnsRequirementContent />', () => {
  let wrapper;

  const props = { activeCardRequirements: ['first requirement', 'second requirement'] };

  beforeEach(() => {
    wrapper = shallow(<AddOnsRequirementContent {...props} />);
  });

  it('is accessible', async () => {
    const { container } = render(<AddOnsRequirementContent {...props} />);
    await checkAccessibility(container);
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
