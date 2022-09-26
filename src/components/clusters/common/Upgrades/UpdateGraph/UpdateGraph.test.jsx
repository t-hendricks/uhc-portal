import React from 'react';
import { shallow } from 'enzyme';

import UpdateGraph from './UpdateGraph';

describe('<UpdateGraph />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <UpdateGraph currentVersion="current version" updateVersion="next version" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VersionLabel').length).toEqual(2);
    expect(wrapper.find('VersionDot').length).toEqual(2);
  });

  it('should render with no updates available', () => {
    const wrapper = shallow(<UpdateGraph currentVersion="1.2.3" />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VersionLabel').length).toEqual(1);
    expect(wrapper.find('VersionDot').length).toEqual(1);
  });

  it('should render when additional versions are available', () => {
    const wrapper = shallow(<UpdateGraph currentVersion="1.2.3" updateVersion="1.2.4" hasMore />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VersionLabel').length).toEqual(2);
    expect(wrapper.find('VersionDot').length).toEqual(2);
    expect(wrapper.find('div.ocm-upgrade-additional-versions-available').length).toEqual(1);
  });
});
