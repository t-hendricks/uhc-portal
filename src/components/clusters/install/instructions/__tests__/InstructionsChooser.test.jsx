import React from 'react';
import { shallow } from 'enzyme';

import { InstructionsChooser } from '../InstructionsChooser';

describe('InstructionsChooser', () => {
  it('renders correctly with default settings', () => {
    const wrapper = shallow(
      <InstructionsChooser
        ipiPageLink="/install/aws/installer-provisioned"
        upiPageLink="/install/aws/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with AI enabled', () => {
    const wrapper = shallow(
      <InstructionsChooser
        aiPageLink="/assisted-installer/clusters/~new"
        ipiPageLink="/install/metal/installer-provisioned"
        upiPageLink="/install/metal/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with AI and UPI', () => {
    const wrapper = shallow(
      <InstructionsChooser
        aiPageLink="/assisted-installer/clusters/~new"
        hideIPI
        upiPageLink="/install/arm/user-provisioned"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
