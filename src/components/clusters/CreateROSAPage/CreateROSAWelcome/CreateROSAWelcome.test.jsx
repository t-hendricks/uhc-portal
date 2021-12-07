import React from 'react';
import { shallow } from 'enzyme';

import CreateROSAWelcome from './CreateROSAWelcome';

describe('<CreateROSAWelcome>', () => {
  it('renders', () => {
    const props = {
      token: { auths: { foo: 'bar' } },
      getAuthToken: () => { },
    };

    const wrapper = shallow(<CreateROSAWelcome {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
