import React from 'react';
import { shallow } from 'enzyme';

import CreateCluster from '../CreateCluster';

describe('<CreateCluster />', () => {
  let openModal;
  let wrapper;
  beforeEach(() => {
    openModal = jest.fn();
    wrapper = shallow(<CreateCluster
      openModal={openModal}
      hasQuota
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('open OSD creation dialog when needed', () => {
    wrapper.find('.create-cluster-card').at(0).simulate('click');
    expect(openModal).toBeCalled();
  });

  describe('User with no quota', () => {
    it('should hide option to create managed and auto installed clusters', () => {
      wrapper = shallow(
        <CreateCluster
          openModal={openModal}
        />,
      );
      expect(wrapper.find('.create-cluster-card').length).toEqual(1);
    });
  });
});
