import React from 'react';
import { shallow } from 'enzyme';

import ClusterStatusMonitor from './ClusterStatusMonitor';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

jest.useFakeTimers('legacy'); // TODO 'modern'

const { clusterDetails } = fixtures;

const status = {
  pending: false,
  fulfilled: false,
  status: {
    id: clusterDetails.cluster.id,
  },
};

describe('<ClusterStatusMonitor />', () => {
  let wrapper;
  const getClusterStatus = jest.fn();
  const refresh = jest.fn();
  beforeAll(() => {
    wrapper = shallow(<ClusterStatusMonitor
      cluster={{ ...clusterDetails.cluster, state: 'installing' }}
      getClusterStatus={getClusterStatus}
      status={status}
      refresh={refresh}
    />);
  });

  it('calls getClusterStatus on mount', () => {
    expect(getClusterStatus).toBeCalledWith(clusterDetails.cluster.id);
  });

  it('sets the timeout when cluster is installing', () => {
    wrapper.setProps(
      {
        status: {
          ...status,
          pending: true,
        },
      },
    ); // set pending: true first since the logic depends on the pending -> fulfilled transition

    wrapper.setProps(
      {
        status: {
          fulfilled: true,
          pending: false,
          status: {
            id: clusterDetails.cluster.id,
            state: 'installing',
          },
        },
      },
    );
    expect(setTimeout).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(getClusterStatus).toHaveBeenLastCalledWith(clusterDetails.cluster.id);
    expect(getClusterStatus).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(refresh).not.toHaveBeenCalled();
  });

  it('renders null when no error', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls refresh when the status changes', () => {
    wrapper.setProps(
      {
        status: {
          ...status,
          pending: true,
        },
      },
    ); // set pending: true first since the logic depends on the pending -> fulfilled transition

    wrapper.setProps(
      {
        status: {
          fulfilled: true,
          pending: false,
          status: {
            id: clusterDetails.cluster.id,
            state: 'error',
          },
        },
      },
    );
    expect(refresh).toBeCalled();
  });

  it('renders an alert when cluster is errored', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
