import React from 'react';
import { shallow } from 'enzyme';

import RegisterCluster from '../RegisterCluster';

describe('<RegisterCluster />', () => {
  it('renders correctly', () => {
    const handleSubmit = jest.fn();
    const resetResponse = jest.fn();
    const registerClusterResponse = {
      error: false,
      errorMessage: '',
      pending: false,
      fulfilled: false,
      cluster: null,
    };

    const wrapper = shallow(<RegisterCluster
      resetResponse={resetResponse}
      handleSubmit={handleSubmit}
      registerClusterResponse={registerClusterResponse}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
