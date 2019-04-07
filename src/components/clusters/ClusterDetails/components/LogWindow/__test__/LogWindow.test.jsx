import React from 'react';
import { shallow } from 'enzyme';

import LogWindow from '../LogWindow';
import { clusterDetails } from '../../../__test__/ClusterDetails.fixtures';

describe('<LogWindow />', () => {
  let wrapper;
  const clearLogs = jest.fn();

  beforeAll(() => {
    wrapper = shallow(<LogWindow
      clusterID={clusterDetails.cluster.id}
      clearLogs={clearLogs}
      lines="lorem ipsum"
    />);
  });

  it('should render with logs', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without logs', () => {
    wrapper = shallow(<LogWindow
      clusterID={clusterDetails.cluster.id}
      clearLogs={clearLogs}
      lines={null}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
