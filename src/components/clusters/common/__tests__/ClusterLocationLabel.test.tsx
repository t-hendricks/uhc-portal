import React from 'react';
import { useDispatch } from 'react-redux';
import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import { withState } from '~/testUtils';
import ClusterLocationLabel, { ClusterLocationLabelProps } from '../ClusterLocationLabel';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('~/redux/actions/cloudProviderActions');

describe('<ClusterLocationLabel />', () => {
  const defaultCloudProviders = {
    pending: false,
    fulfilled: false,
    error: false,
    providers: {},
  };

  const defaultProps: ClusterLocationLabelProps = {
    cloudProviderID: 'aws',
    regionID: 'us-east-1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches cloud providers on render', () => {
    // Arrange
    const dispatchMock = jest.fn();
    (useDispatch as any as jest.Mock).mockReturnValue(dispatchMock);
    (getCloudProviders as jest.Mock).mockReturnValue('cloudProviders');
    const currentState = { cloudProviders: defaultCloudProviders };

    expect(getCloudProviders).not.toBeCalled();

    // Act
    withState(currentState).render(<ClusterLocationLabel {...defaultProps} />);

    // Asseret
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith('cloudProviders');
  });

  it("displays cloud provider and region when there's no provider data available", () => {
    // Arrange
    const currentState = { cloudProviders: defaultCloudProviders };

    // Act
    const { container } = withState(currentState).render(
      <ClusterLocationLabel {...defaultProps} />,
    );

    // Assert
    expect(container.textContent).toEqual('AWS (us-east-1)');
  });

  it('does not display region  when region is not known', () => {
    // Arrange
    const currentState = { cloudProviders: defaultCloudProviders };

    // Act
    const { container } = withState(currentState).render(
      <ClusterLocationLabel cloudProviderID="gcp" regionID="N/A" />,
    );

    // Assert
    expect(container.textContent).toEqual('GCP');
  });

  it('displays content from providers when providers have been fetched', () => {
    // Arrange
    const currentState = {
      cloudProviders: {
        fulfilled: true,
        providers: { baremetal: { display_name: 'Bare Metal' } },
      },
    };

    // Act
    const { container } = withState(currentState).render(
      <ClusterLocationLabel cloudProviderID="baremetal" regionID="some-region" />,
    );

    // Assert
    expect(container.textContent).toEqual('Bare Metal (some-region)');
  });
});
