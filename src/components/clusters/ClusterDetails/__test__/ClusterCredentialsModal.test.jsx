import React from 'react';
import { shallow } from 'enzyme';

import ClusterCredentialsModal from '../components/ClusterCredentialsModal/ClusterCredentialsModal';

describe('<ClusterCredentialsModal />', () => {
  let closeFunc;
  let wrapper;
  let credentials;
  beforeEach(() => {
    closeFunc = jest.fn();
    credentials = {
      admin: {
        user: 'foo',
        password: 'bar',
      },
    };
    wrapper = shallow(<ClusterCredentialsModal
      credentials={credentials}
      close={closeFunc}
      isOpen
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('doesn\'t render when closed', () => {
    wrapper = shallow(<ClusterCredentialsModal
      credentials={credentials}
      close={closeFunc}
      isOpen={false}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
