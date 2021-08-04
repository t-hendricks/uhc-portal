import React from 'react';
import { shallow } from 'enzyme';

import TokenErrorAlert from '../TokenErrorAlert';

describe('TokenErrorAlert', () => {
  const token = { auths: { foo: 'bar' } };
  it('renders correctly', () => {
    const wrapper = shallow(<TokenErrorAlert token={token} />);
    expect(wrapper).toMatchSnapshot();
  });
});
