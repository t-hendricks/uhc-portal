import React from 'react';
import { shallow } from 'enzyme';

import DevPreviewBadge from './DevPreviewBadge';

describe('<DevPreviewBadge>', () => {
  it('renders', () => {
    const component = shallow(<DevPreviewBadge />);
    expect(component).toMatchSnapshot();
  });
});
