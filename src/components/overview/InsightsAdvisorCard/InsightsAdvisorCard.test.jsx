import React from 'react';
import { shallow } from 'enzyme';
import InsightsAdvisorCard from './InsightsAdvisorCard';

const initialState = {
  overview: {
    clusters_hit: 0,
  },
  groups: [],
};

describe('<InsightsAdvisorCard />', () => {
  let wrapper;

  describe('When no Advisor recommendations (no rule hits)', () => {
    beforeEach(() => {
      wrapper = shallow(
        <InsightsAdvisorCard
          overview={initialState.overview}
          groups={initialState.groups}
        />,
      );
    });

    it('renders empty state', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('When recommendations are available (rule hits)', () => {
    beforeEach(() => {
      const overview = {
        clusters_hit: 3,
        hit_by_risk: {
          1: 1,
          2: 2,
        },
        hit_by_tag: {
          tag1: 3,
          tag2: 2,
          tag3: 2,
        },
      };
      const groups = [
        {
          title: 'title1',
          description: 'title1 desc',
          tags: ['tag1'],
        },
        {
          title: 'title2',
          description: 'title2 desc',
          tags: ['tag2'],
        },
      ];
      wrapper = shallow(
        <InsightsAdvisorCard
          overview={overview}
          groups={groups}
        />,
      );
    });

    it('renders two charts', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
