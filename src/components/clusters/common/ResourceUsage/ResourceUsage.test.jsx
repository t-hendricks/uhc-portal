import React from 'react';
import { shallow } from 'enzyme';

import ResourceUsage from './ResourceUsage';
import { metricsStatusMessages } from './ResourceUsage.consts';

const cpu = {
  used: {
    value: 3.995410922987096,
  },
  total: {
    value: 16,
  },
};

const memory = {
  used: {
    value: 16546058240,
    unit: 'B',
  },
  total: {
    value: 82293346304,
    unit: 'B',
  },
};

describe('<ResourceUsage />', () => {
  it('should render no type', () => {
    const wrapper = shallow(
      <ResourceUsage
        cpu={cpu}
        memory={memory}
        type=""
        metricsAvailable
        metricsStatusMessage={metricsStatusMessages.default}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render type threshold', () => {
    const wrapper = shallow(
      <ResourceUsage
        cpu={cpu}
        memory={memory}
        metricsAvailable
        metricsStatusMessage={metricsStatusMessages.default}
        type="threshold"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render type legend', () => {
    const wrapper = shallow(
      <ResourceUsage
        cpu={cpu}
        memory={memory}
        metricsAvailable
        metricsStatusMessage={metricsStatusMessages.default}
        type="legend"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render status message when metrics are not available', () => {
    const wrapper = shallow(
      <ResourceUsage
        cpu={cpu}
        memory={memory}
        metricsAvailable={false}
        metricsStatusMessage={metricsStatusMessages.default}
        type="threshold"
      />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('p').length).toEqual(1);
  });

  it('should render correct status message when archived', () => {
    const wrapper = shallow(
      <ResourceUsage
        cpu={cpu}
        memory={memory}
        metricsAvailable={false}
        metricsStatusMessage={metricsStatusMessages.archived}
        type="threshold"
      />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('p').length).toEqual(1);
  });
});
