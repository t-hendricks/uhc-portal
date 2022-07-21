import React from 'react';
import { shallow } from 'enzyme';

import InstructionsChooser from '../InstructionsChooser';

describe('InstructionsChooser', () => {
  it('renders correctly with default settings', () => {
    const wrapper = shallow(
      <InstructionsChooser
        cloudName="AWS"
        ipiPageLink="/install/aws/installer-provisioned"
        upiPageLink="/install/aws/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with AI enabled', () => {
    const wrapper = shallow(
      <InstructionsChooser
        cloudName="Bare Metal"
        showAI
        preferAI
        ipiPageLink="/install/metal/installer-provisioned"
        upiPageLink="/install/metal/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with AI and UPI', () => {
    const wrapper = shallow(
      <InstructionsChooser
        cloudName="ARM Bare Metal"
        showAI
        preferAI
        hideIPI
        upiPageLink="/install/arm/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
