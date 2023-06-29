import React from 'react';
import { mount } from 'enzyme';

import { PreviewLabel, GA_DATE, createdPostGa } from '~/components/clusters/common/PreviewLabel';

describe('PreviewLabel', () => {
  it('pre GA date', () => {
    const now = new Date(GA_DATE);
    now.setSeconds(GA_DATE.getSeconds() - 1);
    const wrapper = mount(<PreviewLabel creationDateStr={now.toISOString()} />);
    expect(wrapper).toMatchSnapshot();
    expect(createdPostGa(now.toISOString())).toBe(false);
  });

  it('post GA date', () => {
    const now = new Date(GA_DATE);
    const wrapper = mount(<PreviewLabel creationDateStr={now.toISOString()} />);
    expect(wrapper).toMatchSnapshot();
    expect(createdPostGa(now.toISOString())).toBe(true);
    now.setSeconds(GA_DATE.getSeconds() + 1);
    expect(wrapper).toMatchSnapshot();
    expect(createdPostGa(now.toISOString())).toBe(true);
  });
});
