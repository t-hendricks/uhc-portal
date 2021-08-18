import React from 'react';
import { shallow } from 'enzyme';
import TopOverviewSection from './TopOverviewSection';

describe('<TopOverviewSection />', () => {
  const totalClusters = 10;
  const totalConnectedClusters = 10;
  const totalUnhealthyClusters = 4;
  const totalCPU = { value: 4 };
  const usedCPU = { value: 3 };
  const totalMem = { value: 10 };
  const usedMem = { value: 5 };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <TopOverviewSection
        totalClusters={totalClusters}
        totalUnhealthyClusters={totalUnhealthyClusters}
        totalConnectedClusters={totalConnectedClusters}
        totalCPU={totalCPU}
        usedCPU={usedCPU}
        totalMem={totalMem}
        usedMem={usedMem}
        isError={false}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
