import React from 'react';
import { shallow } from 'enzyme';

import ClusterStatusMonitor from './ClusterStatusMonitor';
import fixtures from '../../../__test__/ClusterDetails.fixtures';

jest.useFakeTimers('legacy'); // TODO 'modern'

const { clusterDetails, inflightChecks } = fixtures;

const status = {
  pending: false,
  fulfilled: false,
  status: {
    id: clusterDetails.cluster.id,
  },
};

describe('<ClusterStatusMonitor />', () => {
  let wrapper;
  let getClusterStatus;
  let getInflightChecks;
  let refresh;
  let history;
  beforeEach(() => {
    getClusterStatus = jest.fn();
    getInflightChecks = jest.fn();
    refresh = jest.fn();
    history = { push: jest.fn() };
    wrapper = shallow(
      <ClusterStatusMonitor
        cluster={{ ...clusterDetails.cluster, state: 'installing' }}
        inflightChecks={inflightChecks}
        getClusterStatus={getClusterStatus}
        getInflightChecks={getInflightChecks}
        status={status}
        refresh={refresh}
        history={history}
      />,
    );
  });

  it('calls getClusterStatus on mount', () => {
    expect(getClusterStatus).toBeCalledWith(clusterDetails.cluster.id);
    expect(getInflightChecks).toBeCalledWith(clusterDetails.cluster.id);
  });

  it('sets the timeout when cluster is installing', () => {
    wrapper.setProps({
      status: {
        ...status,
        pending: true,
      },
    }); // set pending: true first since the logic depends on the pending -> fulfilled transition

    wrapper.setProps({
      status: {
        fulfilled: true,
        pending: false,
        status: {
          id: clusterDetails.cluster.id,
          state: 'installing',
        },
      },
      inflightChecks: {
        fulfilled: true,
        pending: false,
        checks: [],
      },
    });
    expect(setTimeout).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(getClusterStatus).toHaveBeenLastCalledWith(clusterDetails.cluster.id);
    expect(getClusterStatus).toHaveBeenCalledTimes(2); // one call on mount, second on timer
    expect(refresh).not.toHaveBeenCalled();
  });

  it('renders null when no error', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Displays warning when install takes longer', () => {
    wrapper.setProps({
      status: {
        fulfilled: true,
        pending: false,
        status: {
          id: clusterDetails.cluster.id,
          state: 'installing',
          provision_error_code: '',
          provision_error_message: 'Install taking longer than expected',
        },
      },
      inflightChecks: {
        fulfilled: true,
        pending: false,
        checks: [],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('calls refresh when the status changes', () => {
    wrapper.setProps({
      status: {
        ...status,
        pending: true,
      },
      inflightChecks: {
        pending: true,
        checks: [],
      },
    }); // set pending: true first since the logic depends on the pending -> fulfilled transition

    wrapper.setProps({
      status: {
        fulfilled: true,
        pending: false,
        status: {
          id: clusterDetails.cluster.id,
          state: 'error',
          provision_error_code: 'OCM1002',
          provision_error_message: 'Invalid AWS credentials (authentication)',
        },
      },
      inflightChecks: {
        fulfilled: true,
        pending: false,
        checks: [],
      },
    });
    expect(refresh).toBeCalled();
  });

  it('renders an alert when cluster is errored', () => {
    wrapper.setProps({
      status: {
        fulfilled: true,
        pending: false,
        status: {
          id: clusterDetails.cluster.id,
          state: 'error',
          provision_error_code: 'OCM1002',
          provision_error_message: 'Invalid AWS credentials (authentication)',
        },
      },
      inflightChecks: {
        fulfilled: true,
        pending: false,
        checks: [],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
