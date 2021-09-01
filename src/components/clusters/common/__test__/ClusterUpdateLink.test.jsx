import React from 'react';
import { shallow } from 'enzyme';
import ClusterUpdateLink from '../ClusterUpdateLink';

describe('<ClusterUpdateLink />', () => {
  it('renders null for OCP when no upgrades are available', () => {
    const cluster = {
      managed: false,
      metrics: {
        upgrade: {
          available: false,
        },
      },
    };
    const wrapper = shallow(<ClusterUpdateLink
      cluster={cluster}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toMatchObject({});
  });

  it('shows previous and next version numbers when an upgrade is running', () => {
    const cluster = {
      openshift_version: 'some-old-version',
      version: {
        raw_id: 'some-old-version',
      },
      metrics: {
        upgrade: {
          available: true,
          state: 'running',
          version: 'some-new-version',
        },
      },
    };
    const wrapper = shallow(<ClusterUpdateLink
      cluster={cluster}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
