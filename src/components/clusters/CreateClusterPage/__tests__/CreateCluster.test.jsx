import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterPage from '../CreateClusterPage';

describe('<CreateClusterPage />', () => {
  const getOrganizationAndQuota = jest.fn();
  const getAuthToken = jest.fn();
  const organization = {
    details: null,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
  };
  const push = jest.fn();
  let wrapper;

  it('renders correctly', () => {
    wrapper = shallow(<CreateClusterPage
      hasOSDQuota
      getOrganizationAndQuota={getOrganizationAndQuota}
      organization={{ ...organization, fulfilled: true }}
      token={{}}
      getAuthToken={getAuthToken}
      history={{ push }}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('renders correctly for specific tabs', () => {
    it('cloud tab', () => {
      wrapper.setProps({ activeTab: 'cloud' });
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Tabs').props().activeKey).toEqual(0);
    });
    it('datacenter tab', () => {
      wrapper.setProps({ activeTab: 'datacenter' });
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Tabs').props().activeKey).toEqual(1);
    });
    it('local tab', () => {
      wrapper.setProps({ activeTab: 'local' });
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('Tabs').props().activeKey).toEqual(2);
    });
  });

  describe('User with no quota', () => {
    it('should render', () => {
      wrapper = shallow(
        <CreateClusterPage
          hasOSDQuota={false}
          getOrganizationAndQuota={getOrganizationAndQuota}
          organization={{ ...organization, fulfilled: true }}
          token={{}}
          getAuthToken={getAuthToken}
          history={{ push }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Quota not fetched yet', () => {
    beforeAll(() => {
      wrapper = shallow(<CreateClusterPage
        hasOSDQuota={false}
        getOrganizationAndQuota={getOrganizationAndQuota}
        organization={organization}
        token={{}}
        getAuthToken={getAuthToken}
        history={{ push }}
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
