import React from 'react';
import { shallow } from 'enzyme';

import CreateCluster from '../CreateCluster';

describe('<CreateCluster />', () => {
  let openModal;
  let wrapper;
  const getOrganization = jest.fn();
  const getOrganizationAndQuota = jest.fn();
  const organization = {
    details: null,
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
      getOrganizationAndQuota={getOrganizationAndQuota}
      getOrganization={getOrganization}
      organization={organization}
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
          getOrganizationAndQuota={getOrganizationAndQuota}
          organization={organization}
        />,
      );
      expect(wrapper.find('.create-cluster-card').length).toEqual(1);
    });
  });
});
