import React from 'react';
import { shallow } from 'enzyme';

import RouterShardInputForm from './RouterShardInputForm';

describe('<RouterShardInputForm />', () => {
  it('renders correctly', () => {
    const input = {
      name: 'name',
      value: {
        label: 'label',
        scheme: 'scheme',
      },
    };
    const meta = {
      dispatch: () => {},
      error: undefined,
      form: 'form',
      touched: false,
    };
    const wrapper = shallow(<RouterShardInputForm input={input} meta={meta} />);
    expect(wrapper).toMatchSnapshot();
  });
});
