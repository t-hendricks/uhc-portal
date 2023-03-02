import React from 'react';
import { shallow } from 'enzyme';

import SupportLevelBadge, { SupportLevelType } from './SupportLevelBadge';

describe('<SupportLevelBadge>', () => {
  it('renders for devPreview badges', () => {
    const component = shallow(<SupportLevelBadge type={SupportLevelType.devPreview} />);
    expect(component).toMatchSnapshot();
  });

  it('renders for cooperative community badges', () => {
    const component = shallow(<SupportLevelBadge type={SupportLevelType.cooperativeCommunity} />);
    expect(component).toMatchSnapshot();
  });
});
