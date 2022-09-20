import React from 'react';
import { shallow } from 'enzyme';

import withAnalytics from '../withAnalytics';

describe('withAnalytics', () => {
  let wrapper;

  beforeEach(() => {
    const AnalyticsContext = withAnalytics(() => <div>test</div>);
    wrapper = shallow(<AnalyticsContext />);
  });

  describe('wrapper', () => {
    it('should render successfully', () => {
      expect(wrapper.html()).not.toBe(null);
    });
  });

  describe('contents', () => {
    let contents;

    beforeAll(() => {
      contents = wrapper.dive();
    });

    it('should match snapshot', () => {
      expect(contents).toMatchSnapshot();
    });

    it('should render successfully', () => {
      expect(contents.html()).not.toBe(null);
      expect(contents.text()).toEqual('test');
    });
  });
});
