import React from 'react';
import { shallow } from 'enzyme';

import LogWindow from '../components/LogWindow/LogWindow';
import { clusterDetails } from './ClusterDetails.fixtures';

describe('<LogWindow />', () => {
  let wrapper;
  const getLogs = jest.fn();

  beforeAll(() => {
    wrapper = shallow(<LogWindow
      clusterID={clusterDetails.cluster.id}
      getLogs={getLogs}
      lines="lorem ipsum"
    />);
  });

  it('should render with logs', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get logs', () => {
    expect(getLogs).toBeCalledWith(clusterDetails.cluster.id);
  });

  it('should render without logs', () => {
    wrapper = shallow(<LogWindow
      clusterID={clusterDetails.cluster.id}
      getLogs={getLogs}
      lines={null}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
