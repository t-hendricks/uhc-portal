import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';

// eslint-disable-next-line import/extensions
import { reduxFormRegisterCluster as ReduxFormRegisterCluster } from '../index.js';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => `Redirected to "${to}"`),
}));

describe('<RegisterCluster />', () => {
  const handleSubmit = jest.fn();
  const resetResponse = jest.fn();
  const resetForm = jest.fn();
  const getOrganizationAndQuota = jest.fn();
  const onSubmit = jest.fn();

  const registerClusterResponse = {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  };
  const baseProps = {
    resetResponse,
    handleSubmit,
    resetForm,
    getOrganizationAndQuota,
    onSubmit,
    registerClusterResponse,
    quotaResponse: { fulfilled: true },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.unmock('react-router-dom');
  });

  it.skip('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <ReduxFormRegisterCluster {...baseProps} canSubscribeOCP />
      </TestRouter>,
    );

    // This test fails with a Heading levels should only increase by one (heading-order) error
    await checkAccessibility(container);
  });

  it('shows spinner when quota has not been fulfilled', () => {
    const quotaLoadingProps = {
      ...baseProps,
      quotaResponse: { fulfilled: false },
    };
    render(
      <TestRouter>
        <ReduxFormRegisterCluster {...quotaLoadingProps} canSubscribeOCP />
      </TestRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByLabelText('Cluster ID', { exact: false })).not.toBeInTheDocument();

    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('shows form when quota has been fulfilled', () => {
    const quotaLoadingProps = {
      ...baseProps,
      quotaResponse: { fulfilled: true },
    };
    render(
      <TestRouter>
        <ReduxFormRegisterCluster {...quotaLoadingProps} canSubscribeOCP />
      </TestRouter>,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cluster ID', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('redirects to cluster details when the cluster data is fulfilled', () => {
    const clusterDataFulfilledProps = {
      ...baseProps,
      registerClusterResponse: {
        fulfilled: true,
        cluster: { id: 'myClusterId' },
      },
    };
    render(
      <TestRouter>
        <ReduxFormRegisterCluster {...clusterDataFulfilledProps} canSubscribeOCP />
      </TestRouter>,
    );

    expect(screen.getByText('Redirected to "/details/s/myClusterId"')).toBeInTheDocument();
  });
});
