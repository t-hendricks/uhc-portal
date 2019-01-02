import React from 'react';
import { shallow } from 'enzyme';

import CreateClusterDropdown from './CreateClusterDropdown';

describe('<CreateClusterDropdown />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<CreateClusterDropdown showCreationForm={onClickFunc} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls showCreationForm when needed', () => {
    wrapper.find('MenuItem').at(0).simulate('click');
    expect(onClickFunc).toBeCalled();
  });
});
