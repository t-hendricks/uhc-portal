import React from 'react';
import { render } from '~/testUtils';
import ClusterLocationLabel from './ClusterLocationLabel';

describe('<ClusterLocationLabel />', () => {
  const getCloudProviders = jest.fn();

  const defaultProps = {
    getCloudProviders,
    cloudProviderID: 'aws',
    regionID: 'us-east-1',
    cloudProviders: {
      pending: false,
      fulfilled: false,
      error: false,
      providers: {},
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches cloud providers on render', () => {
    expect(getCloudProviders).not.toBeCalled();
    render(<ClusterLocationLabel {...defaultProps} />);
    expect(getCloudProviders).toBeCalled();
  });

  it("displays cloud provider and region when there's no provider data available", () => {
    expect(defaultProps.cloudProviders.providers).toEqual({});
    const { container } = render(<ClusterLocationLabel {...defaultProps} />);

    expect(container.textContent).toEqual('AWS (us-east-1)');
  });

  it('does not display region  when region is not known', () => {
    const newProps = { ...defaultProps, cloudProviderID: 'gcp', regionID: 'N/A' };
    const { container } = render(<ClusterLocationLabel {...newProps} />);

    expect(container.textContent).toEqual('GCP');
  });

  it('displays content from providers when providers have been fetched', () => {
    const newProps = {
      ...defaultProps,
      cloudProviderID: 'baremetal',
      regionID: 'some-region',
      cloudProviders: { fulfilled: true, providers: { baremetal: { display_name: 'Bare Metal' } } },
    };

    const { container } = render(<ClusterLocationLabel {...newProps} />);

    expect(container.textContent).toEqual('Bare Metal (some-region)');
  });
});
