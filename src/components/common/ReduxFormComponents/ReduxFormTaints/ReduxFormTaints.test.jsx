import React from 'react';
import { shallow } from 'enzyme';
import ReduxFormTaints from './ReduxFormTaints';
import MockFields from '../ReduxFormKeyValueList/ReduxFormKeyValueList.test';

describe('<ReduxFormTaints />', () => {
  const emptyListFields = new MockFields({});
  const listWithItemsFields = new MockFields({ key: 'foo', value: 'bar', effect: 'NoExecute' }, { key: 'foo2', value: 'bar2', effect: 'NoSchedule' });

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ReduxFormTaints
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
});
