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
    const props = { ...Fixtures, clusterDetails: { ...Fixtures.clusterDetails, error: true } };
    const wrapper = shallow(<ClusterDetails {...props} />);

    it('should render error message', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Alert').length).toEqual(1);
    });
  });
});
