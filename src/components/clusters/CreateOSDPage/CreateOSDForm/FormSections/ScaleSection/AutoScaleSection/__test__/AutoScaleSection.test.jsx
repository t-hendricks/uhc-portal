import React from 'react';
import { shallow } from 'enzyme';

import AutoScaleSection from '../AutoScaleSection';
import { normalizedProducts } from '../../../../../../../../common/subscriptionTypes';

describe('<AutoScaleSection />', () => {
  const change = jest.fn();
  const props = {
    autoscalingEnabled: true,
    isMultiAz: false,
    product: normalizedProducts.OSD,
    isBYOC: false,
    isDefaultMachinePool: false,
    change,
  };

  it('renders correctly when autoscale enabled', () => {
    const autoScaleEnabledwrapper = shallow(<AutoScaleSection {...props} />);
    expect(autoScaleEnabledwrapper).toMatchSnapshot();
  });

  const autoscaleDisabledProps = { ...props, autoscalingEnabled: false };
  const autoscaleDisabledWrapper = shallow(<AutoScaleSection {...autoscaleDisabledProps} />);

  it('renders correctly when autoscale disabled', () => {
    expect(autoscaleDisabledWrapper).toMatchSnapshot();
  });

  it('renders correctly for multiAz', () => {
    const multiAzProps = { ...props, isMultiAz: true };
    const wrapper = shallow(<AutoScaleSection {...multiAzProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Set min nodes correctly when enabling autoscale for multiAZ', () => {
    autoscaleDisabledWrapper.setProps({
      autoscalingEnabled: true,
      isMultiAz: true,
      isDefaultMachinePool: true,
    });
    expect(change).toBeCalledWith('min_replicas', '3');
  });
});
