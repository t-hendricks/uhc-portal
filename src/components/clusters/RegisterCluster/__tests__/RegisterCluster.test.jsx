import React from 'react';
import { shallow } from 'enzyme';

import RegisterCluster from '../RegisterCluster';

describe('<RegisterCluster />', () => {
  const handleSubmit = jest.fn();
  const resetResponse = jest.fn();
  const resetForm = jest.fn();
  const getOrganizationAndQuota = jest.fn();
  const onSubmit = jest.fn();
  const registerClusterResponse = {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    cluster: null,
  };
  const baseProps = {
    resetResponse,
    handleSubmit,
    resetForm,
    getOrganizationAndQuota,
    onSubmit,
    registerClusterResponse,
    quotaResponse: { fulfilled: true },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<RegisterCluster {...baseProps} canSubscribeOCP />);

    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly when user can't subscribe ocp", () => {
    const wrapper = shallow(<RegisterCluster {...baseProps} canSubscribeOCP={false} />);

    expect(wrapper).toMatchSnapshot();
  });
});
