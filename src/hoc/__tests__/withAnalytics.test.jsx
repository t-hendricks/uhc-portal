import React from 'react';
import { shallow } from 'enzyme';

import withAnalytics from '../withAnalytics';

describe('withAnalytics', () => {
  let wrapper;
  let contents;

  beforeEach(() => {
    const AnalyticsContext = withAnalytics(() => (
      <div>test</div>
    ));
    wrapper = shallow(<AnalyticsContext />);
    contents = wrapper.dive();
  });

  it('should match snapshot', () => {
    expect(contents).toMatchSnapshot();
    // (no use in testing the wrapper; that's the templating-engine's domain)
  });

  it('should render successfully', () => {
    expect(wrapper.html()).not.toBe(null);
  });

  it('should render the wrapped component', () => {
    expect(contents.text()).toEqual('test');
  });
});
