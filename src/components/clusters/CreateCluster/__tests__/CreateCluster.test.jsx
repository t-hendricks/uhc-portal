import React from 'react';
import { shallow } from 'enzyme';

import CreateCluster from '../CreateCluster';

describe('<CreateCluster />', () => {
  let openModal;
  let wrapper;
  const getOrganization = jest.fn();
  const getQuota = jest.fn();
  const organization = {
    details: null,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };
  const quota = {
    quotaList: {},
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };

  beforeEach(() => {
    openModal = jest.fn();
    wrapper = shallow(<CreateCluster
      openModal={openModal}
      hasQuota
      getQuota={getQuota}
      getOrganization={getOrganization}
      organization={organization}
      quota={quota}
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('User with no quota', () => {
    it('should hide option to create managed and auto installed clusters', () => {
      wrapper = shallow(
        <CreateCluster
          openModal={openModal}
          getQuota={getQuota}
          getOrganization={getOrganization}
          organization={organization}
          quota={quota}
        />,
      );
      expect(wrapper.find('.create-cluster-card').length).toEqual(1);
    });
  });
});
