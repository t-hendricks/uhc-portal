import React from 'react';
import { shallow } from 'enzyme';
import ReduxFormKeyValueList from './ReduxFormKeyValueList';

export default class MockFields extends Array {
  constructor(...args) {
    super(...args);
    this.push = jest.fn();
    this.get = () => 'id';
    this.remove = jest.fn();
    this.getAll = jest.fn();
  }
}

describe('<ReduxFormKeyValueList />', () => {
  const emptyListFields = new MockFields({});
  const listWithItemsFields = new MockFields({ key: 'aa', value: 'bb' }, { key: 'cc', value: 'dd' });

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ReduxFormKeyValueList
      fields={emptyListFields}
      meta={{ error: '', submitFailed: false }}
    />);
  });

  it('should render when there is no input - initial reder', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with input', () => {
    wrapper.setProps({ fields: listWithItemsFields });
    expect(wrapper).toMatchSnapshot();
  });

  it('should add a new item', () => {
    wrapper.setProps({ fields: listWithItemsFields });
    const addBtn = wrapper.find('Button[className="reduxFormKeyValueList-addBtn"]');
    addBtn.simulate('click');
    expect(listWithItemsFields.push).toBeCalled();
  });

  it('should remove an item', () => {
    wrapper.setProps({ fields: listWithItemsFields });
    const rmBtn = wrapper.find('Button[className="reduxFormKeyValueList-removeBtn"]');
    rmBtn.at(1).simulate('click');
    expect(listWithItemsFields.remove).toBeCalled();
  });
});
