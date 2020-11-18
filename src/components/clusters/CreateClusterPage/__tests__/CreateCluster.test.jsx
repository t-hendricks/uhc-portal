import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterPage from '../CreateClusterPage';

describe('<CreateClusterPage />', () => {
  const getOrganizationAndQuota = jest.fn();
  const organization = {
    details: null,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };

  it('renders correctly', () => {
    const wrapper = shallow(<CreateClusterPage
      hasOSDQuota
      getOrganizationAndQuota={getOrganizationAndQuota}
      organization={{ ...organization, fulfilled: true }}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('User with no quota', () => {
    it('should render', () => {
      const wrapper = shallow(
        <CreateClusterPage
          hasOSDQuota={false}
          getOrganizationAndQuota={getOrganizationAndQuota}
          organization={{ ...organization, fulfilled: true }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Quota not fetched yet', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CreateClusterPage
        hasOSDQuota={false}
        getOrganizationAndQuota={getOrganizationAndQuota}
        organization={organization}
      />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should fetch quota', () => {
      expect(getOrganizationAndQuota).toBeCalled();
    });
  });
});
