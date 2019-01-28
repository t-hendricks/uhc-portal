import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterDropdown from './CreateClusterDropdown';

describe('<CreateClusterDropdown />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<CreateClusterDropdown
      showCreationForm={onClickFunc}
      showOCPCreationForm={onClickFunc}
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls showOCPCreationForm when needed', () => {
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(onClickFunc).toBeCalled();
  });

  it('calls showCreationForm when needed', () => {
    wrapper.find('MenuItem').at(2).simulate('click');
    expect(onClickFunc).toBeCalled();
  });
});
