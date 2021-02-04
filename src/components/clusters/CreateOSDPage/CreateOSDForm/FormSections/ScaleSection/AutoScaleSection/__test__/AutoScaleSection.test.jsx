import React from 'react';
import { shallow } from 'enzyme';

import AutoScaleSection from '../AutoScaleSection';
import { normalizedProducts } from '../../../../../../../../common/subscriptionTypes';

describe('<AutoScaleSection />', () => {
  const props = {
    autoscalingEnabled: true,
    isMultiAz: false,
    product: normalizedProducts.OSD,
    isBYOC: false,
    isDefaultMachinePool: false,
    change: jest.fn(),
  };
  const autoScaleEnabledwrapper = shallow(<AutoScaleSection {...props} />);

  it('renders correctly when autoscale enabled', () => {
    expect(autoScaleEnabledwrapper).toMatchSnapshot();
  });

  it('renders correctly when autoscale disabled', () => {
    const autoscaleDisabledProps = { ...props, autoscalingEnabled: false };
    const wrapper = shallow(<AutoScaleSection {...autoscaleDisabledProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for multiAz', () => {
    const multiAzProps = { ...props, isMultiAz: true };
    const wrapper = shallow(<AutoScaleSection {...multiAzProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
