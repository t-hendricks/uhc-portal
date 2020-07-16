import React from 'react';
import { shallow } from 'enzyme';

import ClusterLogs from '../ClusterLogs';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

describe('<ClusterLogs />', () => {
  let wrapper;
  const getClusterHistory = jest.fn();
  const setSorting = jest.fn();
  const setListFlag = jest.fn();
  const push = jest.fn();

  it('should render', () => {
    wrapper = shallow(<ClusterLogs
      externalClusterID={fixtures.clusterDetails.cluster.external_id}
      history={{ push }}
      getClusterHistory={getClusterHistory}
      setSorting={setSorting}
      setListFlag={setListFlag}
      clusterLogs={{
        requestState: fixtures.clusterDetails,
      }}
      viewOptions={{
        flags: {},
        fields: {},
      }}
    />);
    expect(wrapper)
      .toMatchSnapshot();
  });
});
