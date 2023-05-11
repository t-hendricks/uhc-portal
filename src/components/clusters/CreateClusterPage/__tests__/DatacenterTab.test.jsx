import React from 'react';
import { shallow } from 'enzyme';

import DatacenterTab from '../DatacenterTab';

describe('<DatacenterTab />', () => {
  it('renders correctly with assisted installer and multiarch disabled', () => {
    const wrapper = shallow(
      <DatacenterTab assistedInstallerFeature multiArchFeatureEnabled={false} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with assisted installer and multiarch enabled', () => {
    const wrapper = shallow(<DatacenterTab assistedInstallerFeature multiArchFeatureEnabled />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly without assisted installer and without multiarch', () => {
    const wrapper = shallow(
      <DatacenterTab assistedInstallerFeature={false} multiArchFeatureEnabled={false} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
