import React from 'react';
import { shallow } from 'enzyme';

import HibernatingClusterCard from './HibernatingClusterCard';
import clusterStates from '../clusterStates';

describe('<HibernateClusterModal />', () => {
  let wrapper;
  const openModal = jest.fn();
  const cluster = {
    id: 'test-id',
    name: 'test-cluster',
    subscription: {
      id: 'subscription-id',
    },
    state: clusterStates.HIBERNATING,
  };

  beforeEach(() => {
    wrapper = shallow(<HibernatingClusterCard cluster={cluster} openModal={openModal} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
