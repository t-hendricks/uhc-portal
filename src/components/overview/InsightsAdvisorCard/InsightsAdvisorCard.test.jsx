import React from 'react';
import { shallow, mount } from 'enzyme';
import InsightsAdvisorCard from './InsightsAdvisorCard';
import { categoryMapping } from './ChartByGroups';

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
      expect(wrapper.find('AdvisorEmptyState')).toHaveLength(1);
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
      wrapper = mount(
        <InsightsAdvisorCard
          overview={overview}
          groups={groups}
        />,
      );
    });

    it('renders two charts', () => {
      expect(wrapper.find('ChartByRisks')).toHaveLength(1);
      expect(wrapper.find('ChartByGroups')).toHaveLength(1);
    });

    it('renders single "View more" link to OCP Advisor', () => {
      const link = wrapper.find('a[href="http://localhost/openshift/insights/advisor"]');
      expect(link).toHaveLength(1);
      expect(link.text()).toContain('View more in Insights Advisor');
    });

    it('chart by risks has links to Advisor', () => {
      // four risks in total
      const links = wrapper.find('ChartByRisks').find('.ocm-insights--items__risk-item a');
      expect(links).toHaveLength(4);
      links.forEach(
        // check whether low risk is mapped to 1, moderate to 2, important to 3, critical to 4
        (link, index) => expect(link.props().href).toBe(`http://localhost/openshift/insights/advisor/recommendations?total_risk=${4 - index}`),
      );
    });

    it('chart by groups has links to Advisor', () => {
      const titles = wrapper.find('TitleComponent');
      // four categories in total and four TitleComponents rendered
      expect(titles).toHaveLength(4);
      titles.forEach(
        (title) => {
          // take a tag for the particular category
          const category = title.props().datum.tags;
          // check whether the link is correct with the mapping
          expect(title.find('a').props().href).toBe(`http://localhost/openshift/insights/advisor/recommendations?category=${categoryMapping[category]}`);
        },
      );
    });
  });
});
