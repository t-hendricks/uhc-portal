import React from 'react';
import { shallow } from 'enzyme';

import ClusterListEmptyState from '../ClusterListEmptyState';

describe('<ClusterListEmptyState />', () => {
  let managedFunc;
  let ocpFunc;
  let wrapper;
  beforeEach(() => {
    managedFunc = jest.fn();
    ocpFunc = jest.fn();
    wrapper = shallow(<ClusterListEmptyState
      showCreationForm={managedFunc}
      showOCPCreationForm={ocpFunc}
      hasQuota
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls showOCPCreationForm when needed', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(managedFunc).toBeCalled();
  });

  it('calls showCreationForm when needed', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(ocpFunc).toBeCalled();
  });

  describe('User with no quota', () => {
    it('should hide option to create managed and auto installed clusters', () => {
      wrapper = shallow(
        <ClusterListEmptyState
          showCreationForm={managedFunc}
          showOCPCreationForm={ocpFunc}
        />,
      );
      expect(wrapper.find('Card').length).toEqual(1);
    });
  });
});
