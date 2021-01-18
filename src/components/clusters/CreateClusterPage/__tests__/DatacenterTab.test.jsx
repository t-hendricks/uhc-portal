import React from 'react';
import { shallow } from 'enzyme';

import DatacenterTab from '../DatacenterTab';

describe('<DatacenterTab />', () => {
  it('renders correctly with assisted installer', () => {
    const wrapper = shallow(<DatacenterTab assistedInstallerFeature />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly without assisted installer', () => {
    const wrapper = shallow(<DatacenterTab assistedInstallerFeature={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
