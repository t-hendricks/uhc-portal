import reducer, { initialState } from '../clusterLogReducer';
import { DOWNLOAD_CLUSTER_LOGS, GET_CLUSTER_LOGS } from '../clusterLogConstants';
import { FULFILLED_ACTION } from '../../../../../../redux/reduxHelpers';

describe('cluster log Reducer', () => {
  const mockPayloadGet = {
    logs: {
      data: {
        kind: 'Log',
        id: 'hive',
        href: '/api/clusters_mgmt/v1/clusters/123/logs/hive',
        items: [{
          field: 1,
        }, {
          field: 1,
        }],
      },
      response: {
        data: 'test data',
      },
    },
  };

  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result)
        .toEqual(initialState);
    });
  });

  it('should handle get cluster logs action', () => {
    const action = {
      type: FULFILLED_ACTION(GET_CLUSTER_LOGS),
      payload: mockPayloadGet,
    };
    const result = reducer(initialState, action);

    expect(result)
      .toHaveProperty('logs', mockPayloadGet.logs.data.items);
  });

  it('should handle download cluster logs action', () => {
    const action = {
      type: DOWNLOAD_CLUSTER_LOGS,
      payload: mockPayloadGet,
    };
    const result = reducer(initialState, action);

    expect(result)
      .toHaveProperty('data', mockPayloadGet.logs.data.data);
  });
});
