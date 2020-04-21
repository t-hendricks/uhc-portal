import React from 'react';
import { shallow } from 'enzyme';
import { parseValueWithUnit } from '../../../../common/units';
import SmallClusterChart from './SmallClusterChart';

const getValue = ({ value, unit }) => parseValueWithUnit(value, unit);
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

describe('<SmallClusterChart />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <SmallClusterChart
        title="Memory"
        total={getValue(memory.total)}
        used={getValue(memory.used)}
        unit="B"
        humanize
        donutId="memory_donut"
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
