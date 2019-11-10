import React from 'react';
import { shallow } from 'enzyme';

import CreateCluster from '../CreateCluster';

describe('<CreateCluster />', () => {
  const getOrganizationAndQuota = jest.fn();
  const organization = {
    details: null,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };

  it('renders correctly', () => {
    const wrapper = shallow(<CreateCluster
      hasQuota
      getOrganizationAndQuota={getOrganizationAndQuota}
      organization={{ ...organization, fulfilled: true }}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('User with no quota', () => {
    it('should render', () => {
      const wrapper = shallow(
        <CreateCluster
          hasQuota={false}
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
      wrapper = shallow(<CreateCluster
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
