import React from 'react';
import { shallow } from 'enzyme';

import ClusterDetailsRedirector from './ClusterDetailsRedirector';

describe('<ClusterDetailsRedirector />', () => {
  let wrapper;
  const clearSubscriptionIDForCluster = jest.fn();
  const setGlobalError = jest.fn();

  describe('when pending or not yet fulfilled', () => {
    const fetchSubscriptionIDForCluster = jest.fn();
    beforeEach(() => {
      wrapper = shallow(
        <ClusterDetailsRedirector
          fetchSubscriptionIDForCluster={fetchSubscriptionIDForCluster}
          setGlobalError={setGlobalError}
          clearSubscriptionIDForCluster={clearSubscriptionIDForCluster}
          match={{ params: { id: 'foo' } }}
          location={{ hash: '#bar' }}
          subscriptionIDResponse={{
            fulfilled: false,
          }}
        />,
      );
    });
    it('should render a spinner', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Spinner').length).toBe(1);
    });
    it('should call fetchSubscriptionIDForCluster with the cluster ID', () => {
      expect(fetchSubscriptionIDForCluster).toBeCalledWith('foo');
    });
    it('should not call setGlobalError', () => {
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
        wrapper.setProps({
          subscriptionIDResponse: {
            ...baseErrorResponse,
            errorCode: 404,
          },
        });
        expect(wrapper).toMatchSnapshot();
        const redirect = wrapper.find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.props().to).toEqual('/');
      });
      it('should call setGlobalError', () => {
        expect(setGlobalError).toBeCalledWith(
          expect.anything(), // should be a react node/fragment, but I don't know how to check that
          'clusterDetails',
          'some message',
        );
      });
    });
    describe('500 error', () => {
      it('should render an Unavailable message', () => {
        wrapper.setProps({
          subscriptionIDResponse: {
            ...baseErrorResponse,
            errorCode: 500,
          },
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('Unavailable').length).toBe(1);
      });
    });
  });
  describe('on fulfilled', () => {
    it('should render a redirect', () => {
      wrapper.setProps({
        subscriptionIDResponse: {
          pending: false,
          error: false,
          fulfilled: true,
          id: 'foobar',
        },
      });
      expect(wrapper).toMatchSnapshot();
      const redirect = wrapper.find('Redirect');
      expect(redirect.length).toBe(1);
      expect(redirect.props().to).toEqual('/details/s/foobar#bar');
    });
  });
  it('should clear response on unmount', () => {
    wrapper.unmount();
    expect(clearSubscriptionIDForCluster).toBeCalled();
  });
});
