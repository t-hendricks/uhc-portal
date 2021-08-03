import React from 'react';
import { shallow } from 'enzyme';

import ClusterLocationLabel from './ClusterLocationLabel';

describe('<ClusterLocationLabel />', () => {
  let wrapper;
  const getCloudProviders = jest.fn();
  beforeEach(() => {
    wrapper = shallow(
      <ClusterLocationLabel
        getCloudProviders={getCloudProviders}
        cloudProviderID="aws"
        regionID="us-east-1"
        cloudProviders={{
          pending: false, fulfilled: false, error: false, providers: {},
        }}
      />,
    );
  });
  it('fetches cloud providers if needed', () => {
    expect(getCloudProviders).toBeCalled();
  });

  it('renders correctly when there\'s no provider data available', () => {
    expect(wrapper.text()).toEqual('AWS (us-east-1)');
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when region is not known', () => {
    wrapper.setProps({ cloudProviderID: 'gcp', regionID: 'N/A' });
    expect(wrapper.text()).toEqual('GCP');
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when providers have been fetched', () => {
    wrapper.setProps({
      cloudProviderID: 'baremetal',
      regionID: 'some-region',
      cloudProviders: { fulfilled: true, providers: { baremetal: { display_name: 'Bare Metal' } } },
    });
    expect(wrapper.text()).toEqual('Bare Metal (some-region)');
    expect(wrapper).toMatchSnapshot();
  });
});
