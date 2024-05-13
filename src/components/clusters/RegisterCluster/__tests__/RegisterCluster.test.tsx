import React from 'react';
import * as reactRedux from 'react-redux';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { reduxForm } from 'redux-form';

import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import RegisterCluster from '../RegisterCluster';

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'),
  Navigate: jest.fn(({ to }) => `Redirected to "${to}"`),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

// jest.mock('../EditSubscriptionSettings');

describe('<RegisterCluster />', () => {
  const ConnectedRegisterCluster = reduxForm({
    form: 'RegisterCluster',
  })(RegisterCluster);

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.unmock('react-router-dom');
  });

  it('is accessible', async () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValueOnce({});
    (useGlobalState as jest.Mock).mockReturnValueOnce({});
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);

    // Act
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ConnectedRegisterCluster />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    await checkAccessibility(container);
  });

  it('shows spinner when quota has not been fulfilled', () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValueOnce({ fulfilled: false });
    (useGlobalState as jest.Mock).mockReturnValueOnce({});
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);

    // Act
    render(
      <TestRouter>
        <CompatRouter>
          <ConnectedRegisterCluster />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByLabelText('Cluster ID', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('shows form when quota has been fulfilled', () => {
    // Arrange
    for (let i = 0; i < 3; i += 1) {
      (useGlobalState as jest.Mock).mockReturnValueOnce({ fulfilled: true });
      (useGlobalState as jest.Mock).mockReturnValueOnce({});
      (useGlobalState as jest.Mock).mockReturnValueOnce(false);
      (useGlobalState as jest.Mock).mockReturnValueOnce(false);
    }

    // Act
    render(
      <TestRouter>
        <CompatRouter>
          <ConnectedRegisterCluster />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cluster ID', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('Redirected to ', { exact: false })).not.toBeInTheDocument();
  });

  it('redirects to cluster details when the cluster data is fulfilled', () => {
    // Arrange
    (useGlobalState as jest.Mock).mockReturnValueOnce({ fulfilled: true });
    (useGlobalState as jest.Mock).mockReturnValueOnce({
      fulfilled: true,
      cluster: { id: 'myClusterId' },
    });
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);
    (useGlobalState as jest.Mock).mockReturnValueOnce(false);

    // Act
    render(
      <TestRouter>
        <CompatRouter>
          <ConnectedRegisterCluster />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    expect(screen.getByText('Redirected to "/details/s/myClusterId"')).toBeInTheDocument();
  });
});
