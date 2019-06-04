import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterDropdown from '../CreateClusterDropdown';

describe('<CreateClusterDropdown />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<CreateClusterDropdown
      showCreationForm={onClickFunc}
      hasQuota
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls showCreationForm when needed', () => {
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(onClickFunc).toBeCalled();
  });

  describe('User with no quota', () => {
    it('should hide option to create managed and auto installed clusters', () => {
      wrapper = shallow(
        <CreateClusterDropdown
          showCreationForm={onClickFunc}
        />,
      );
      expect(wrapper.find('MenuItem').length).toEqual(1);
    });
  });
});
