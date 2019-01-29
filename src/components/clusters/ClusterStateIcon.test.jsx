import React from 'react';
import { shallow } from 'enzyme';

import ClusterStateIcon from './ClusterStateIcon';

describe('<ClusterStateIcon />', () => {
  it('renders correctly for unknown status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="whatever" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for pending status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="pending" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for installing status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="installing" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for error status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="error" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for ready status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="ready" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for patching status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="patching" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for uninstalling status', () => {
    const wrapper = shallow(<ClusterStateIcon clusterState="uninstalling" />);
    expect(wrapper).toMatchSnapshot();
  });
});
