import React from 'react';
import { shallow } from 'enzyme';

import InstallationLogView from '../InstallationLogView';
import fixtures from '../../../../__test__/ClusterDetails.fixtures';
import clusterStates from '../../../../../common/clusterStates';


jest.useFakeTimers('legacy'); // TODO 'modern'

describe('<InstallationLogView />', () => {
  const { clusterDetails } = fixtures;
  let wrapper;
  const clearLogs = jest.fn();
  const getLogs = jest.fn();

  beforeAll(() => {
    wrapper = shallow(<InstallationLogView
      cluster={clusterDetails.cluster}
      clearLogs={clearLogs}
      getLogs={getLogs}
      refresh={jest.fn()}
      logType="install"
      lines="lorem ipsum"
    />);
  });

  it('should render with logs', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch logs on mount', () => {
    // offset=1 because we have one line on mount in this test
    expect(getLogs).toHaveBeenCalledWith(clusterDetails.cluster.id, 1, 'install');
  });

  it('should fetch logs using a timer', () => {
    expect(getLogs).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(getLogs).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(getLogs).toHaveBeenLastCalledWith(clusterDetails.cluster.id, 1, 'install');
  });

  it('should fetch logs with offset using a timer', () => {
    wrapper.setProps({ lines: 'hello\nworld' });
    jest.runOnlyPendingTimers();
    expect(getLogs).toHaveBeenLastCalledWith(clusterDetails.cluster.id, 2, 'install');
  });

  it('should not fetch logs when pending', () => {
    wrapper.setProps({ pending: true });
    jest.runOnlyPendingTimers();
    // call count after the previous test was 3. this is checking it doesn't increase
    expect(getLogs).toHaveBeenCalledTimes(3);
  });

  it('should clear logs and reset timer on unmount', () => {
    wrapper.unmount();
    expect(clearLogs).toHaveBeenCalled();
    expect(clearInterval).toHaveBeenCalled();
  });


  it('should render without logs', () => {
    wrapper = shallow(<InstallationLogView
      cluster={clusterDetails.cluster}
      clearLogs={clearLogs}
      getLogs={getLogs}
      lines=""
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('without logs, getLogs() offset should be 0', () => {
    expect(getLogs).toHaveBeenLastCalledWith(clusterDetails.cluster.id, 0, 'install');
  });

  it('should stop the timer when recieving 403 error code', () => {
    wrapper.setProps({ errorCode: 403 });
    expect(clearInterval).toHaveBeenCalled();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show any message when cluster status is error', () => {
    wrapper = shallow(<InstallationLogView
      cluster={{ ...clusterDetails.cluster, state: clusterStates.ERROR }}
      clearLogs={clearLogs}
      getLogs={getLogs}
      refresh={jest.fn()}
      logType="install"
      lines="lorem ipsum"
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('p').length).toEqual(0);
  });
});
