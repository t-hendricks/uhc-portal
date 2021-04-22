import React from 'react';
import { shallow } from 'enzyme';

import ExternalLink from './ExternalLink';

describe('<ExternalLink />', () => {
  it('should render', () => {
    const wrapper = shallow(<ExternalLink href="http://example.com">Hello World</ExternalLink>);
    expect(wrapper).toMatchSnapshot();
  });
});
