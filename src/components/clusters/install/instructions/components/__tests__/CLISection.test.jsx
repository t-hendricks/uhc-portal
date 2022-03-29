import React from 'react';
import { shallow } from 'enzyme';

import { channels } from '../../../../../../common/installLinks.mjs';
import CLISection from '../CLISection';

describe('CLISection', () => {
  const token = { auths: { foo: 'bar' } };
  it('renders correctly', () => {
    const wrapper = shallow(<CLISection token={token} channel={channels.STABLE} />);
    expect(wrapper).toMatchSnapshot();
  });
});
