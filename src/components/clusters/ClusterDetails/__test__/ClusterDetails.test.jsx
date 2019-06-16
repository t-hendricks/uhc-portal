import React from 'react';
import { shallow } from 'enzyme';

import ClusterDetails from '../ClusterDetails';
import * as Fixtures from './ClusterDetails.fixtures';

describe('<ClusterDetails />', () => {
  describe('Cluster Details', () => {
    const wrapper = shallow(<ClusterDetails {...Fixtures} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should call clearGlobalError on mount', () => {
      expect(Fixtures.clearGlobalError).toBeCalledWith('clusterDetails');
    });
  });

  describe('Loading', () => {
    const props = { ...Fixtures, match: { params: { id: '1234' } } };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render loading modal when pending', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('LoadingModal').length).toEqual(1);
    });
  });

  describe('Error', () => {
    const props = {
      ...Fixtures,
      clusterDetails: {
        ...Fixtures.clusterDetails,
        error: true,
        cluster: undefined,
      },
    };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render error message', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Alert').length).toEqual(1);
    });

    it('should redirect back to cluster list and set global error on 404 error', () => {
      const props404 = {
        ...Fixtures,
        clusterDetails: {
          ...Fixtures.clusterDetails,
          error: true,
          errorMessage: 'This is an error message',
          errorCode: 404,
          cluster: undefined,
        },
      };
      shallow(<ClusterDetails {...props404} />);

      expect(Fixtures.setGlobalError).toBeCalled();
      expect(Fixtures.history.push).toBeCalledWith('/');
    });
  });
});
