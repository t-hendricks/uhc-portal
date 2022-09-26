import React from 'react';
import { shallow } from 'enzyme';

import DetailsLeft from '../components/Overview/DetailsLeft';
import fixtures from './ClusterDetails.fixtures';

const getCluster = (showAssistedId) => {
  if (showAssistedId) {
    return fixtures.AIClusterDetails.cluster;
  }
  return fixtures.clusterDetails.cluster;
};

describe('<DetailsLeft />', () => {
  const wrapper = (showAssistedId) =>
    shallow(
      <DetailsLeft
        cluster={getCluster(showAssistedId)}
        cloudProviders={fixtures.cloudProviders}
        showAssistedId={showAssistedId}
      />,
    );

  it('should render', () => {
    expect(wrapper(false)).toMatchSnapshot();
  });

  it('should show the extra AI cluster details', () => {
    expect(wrapper(true)).toMatchSnapshot();
  });
});
