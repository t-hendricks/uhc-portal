import React from 'react';
import { shallow } from 'enzyme';

import ModalHeader from './ModalHeader';

describe('ModalHeader', () => {
  let onClose;
  let wrapper;
  beforeEach(() => {
    onClose = jest.fn();
    wrapper = shallow(<ModalHeader onClose={onClose} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('shoud respond to close button', () => {
    wrapper.find('Button').simulate('click');
    expect(onClose).toBeCalled();
  });
});
