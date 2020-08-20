import React from 'react';
import { shallow } from 'enzyme';

import RegisterCluster from '../RegisterCluster';

describe('<RegisterCluster />', () => {
  const handleSubmit = jest.fn();
  const resetResponse = jest.fn();
  const resetForm = jest.fn();
  const getOrganizationAndQuota = jest.fn();
  const registerClusterResponse = {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  };

  it('renders correctly', () => {
    const wrapper = shallow(<RegisterCluster
      resetResponse={resetResponse}
      handleSubmit={handleSubmit}
      resetForm={resetForm}
      getOrganizationAndQuota={getOrganizationAndQuota}
      registerClusterResponse={registerClusterResponse}
      canSubscribeOCP
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when user can\'t subscribe ocp', () => {
    const wrapper = shallow(<RegisterCluster
      resetResponse={resetResponse}
      handleSubmit={handleSubmit}
      resetForm={resetForm}
      getOrganizationAndQuota={getOrganizationAndQuota}
      registerClusterResponse={registerClusterResponse}
      canSubscribeOCP={false}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
