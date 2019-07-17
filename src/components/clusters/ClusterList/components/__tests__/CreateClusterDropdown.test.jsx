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

  describe('User with no quota', () => {
    it('should hide option to create managed and auto installed clusters', () => {
      wrapper = shallow(
        <CreateClusterDropdown
          showCreationForm={onClickFunc}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
