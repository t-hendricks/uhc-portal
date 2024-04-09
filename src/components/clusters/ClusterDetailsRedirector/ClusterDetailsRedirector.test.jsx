import React from 'react';

import { render, screen } from '~/testUtils';

import ClusterDetailsRedirector from './ClusterDetailsRedirector';

jest.mock('react-router-dom-v5-compat', () => ({
  Navigate: jest.fn(({ to }) => `Redirected to "${to}"`),
}));

describe('<ClusterDetailsRedirector />', () => {
  afterAll(() => {
    jest.unmock('react-router-dom-v5-compat');
  });

  const clearSubscriptionIDForCluster = jest.fn();
  const setGlobalError = jest.fn();

  const fetchSubscriptionIDForCluster = jest.fn();
  const defaultProps = {
    fetchSubscriptionIDForCluster,
    setGlobalError,
    clearSubscriptionIDForCluster,
    params: { id: 'foo' },
    location: { hash: '#bar' },
    subscriptionIDResponse: {
      fulfilled: false,
    },
  };

  describe('when pending or not yet fulfilled', () => {
    afterEach(() => {
      clearSubscriptionIDForCluster.mockClear();
      setGlobalError.mockClear();
      fetchSubscriptionIDForCluster.mockClear();
    });

    it('should render a spinner', () => {
      render(<ClusterDetailsRedirector {...defaultProps} />);
      expect(screen.getByRole('status')).toHaveClass('ins-c-spinner ins-m-center');
      expect(fetchSubscriptionIDForCluster).toBeCalledWith('foo');
      expect(setGlobalError).not.toBeCalled();
    });
  });

  describe('on error', () => {
    const baseErrorResponse = {
      error: true,
      pending: false,
      errorMessage: 'some message',
    };
    describe('404 error', () => {
      it('should render a redirect to /', () => {
        const newProps = {
          ...defaultProps,
          subscriptionIDResponse: { ...baseErrorResponse, errorCode: 404 },
        };

        render(<ClusterDetailsRedirector {...newProps} />);
        expect(screen.getByText('Redirected to "/"')).toBeInTheDocument();

        expect(setGlobalError).toBeCalledWith(
          expect.anything(), // should be a react node/fragment, but I don't know how to check that
          'clusterDetails',
          'some message',
        );
      });
    });
    describe('500 error', () => {
      it('should render an Unavailable message', () => {
        const newProps = {
          ...defaultProps,
          subscriptionIDResponse: { ...baseErrorResponse, errorCode: 500 },
        };

        render(<ClusterDetailsRedirector {...newProps} />);
        expect(screen.getByText('This page is temporarily unavailable')).toBeInTheDocument();
      });
    });
  });
  describe('on fulfilled', () => {
    it('should render a redirect', () => {
      const newProps = {
        ...defaultProps,
        subscriptionIDResponse: { pending: false, error: false, fulfilled: true, id: 'foobar' },
      };

      render(<ClusterDetailsRedirector {...newProps} />);
      expect(screen.getByText('Redirected to "/details/s/foobar#bar"')).toBeInTheDocument();
    });
  });
  it('should clear response on unmount', () => {
    clearSubscriptionIDForCluster.mockClear();
    const { unmount } = render(<ClusterDetailsRedirector {...defaultProps} />);
    expect(clearSubscriptionIDForCluster).not.toBeCalled();
    unmount();
    expect(clearSubscriptionIDForCluster).toBeCalled();
  });
});
