import React from 'react';
import { shallow } from 'enzyme';

import UpgradeAcknowledgeLink from '../UpgradeAcknowledgeLink/UpgradeAcknowledgeLink';

let wrapper;

describe('<UpgradeAcknowledgeLink>', () => {
  beforeEach(() => {
    wrapper = shallow(<UpgradeAcknowledgeLink clusterId="myClusterId" hasAcks={false} />);
  });

  it('should show nothing if there is not unmet acknowledgements', () => {
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should show link if has unmet acknowledgements', () => {
    wrapper.setProps({
      hasAcks: true,
    });
    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper).toMatchSnapshot();
  });
});
